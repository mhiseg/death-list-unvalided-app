import { openmrsFetch } from "@openmrs/esm-framework";
import { deathValidatedValue, encounterTypeCheckIn, habitatConcept, maritalStatusConcept, occupationConcept } from "./constant";

const BASE_WS_API_URL = '/ws/rest/v1/';
export const BASE_FH_API_URL = "/ws/fhir2/R4/"
const toDay = new Date();

export async function getCurrentUserRoleSession() {
    let CurrentSession;
    await openmrsFetch(`${BASE_WS_API_URL}session`).then(data => { CurrentSession = data.data.user.systemId.split("-")[0] });
    return CurrentSession;
}

export function getAllPatientDeathPages(limit: number, start: number) {
    return openmrsFetch(`${BASE_WS_API_URL}patient?q=${deathValidatedValue}&limit=${limit}&startIndex=${start}&v=full&includeDead=true`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export function getSizePersonDeath() {
    return  openmrsFetch(`${BASE_WS_API_URL}patient?q=${deathValidatedValue}&includeDead=true`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
async function fetchObsByPatientAndEncounterType(patientUuid: string, encounterType: string) {
    if (patientUuid && encounterType) {
        let encounter = await openmrsFetch(`${BASE_WS_API_URL}encounter?patient=${patientUuid}&encounterType=${encounterType}&v=default`, { method: 'GET' });
        let observations = [];
        let concepts = encounter.data.results[(encounter.data.results?.length) - 1]?.obs;
        if (concepts) {
            await Promise.all(concepts.map(async concept => {
                const obs = await getObs(concept.links[0]?.uri)
                observations.push({ concept: obs?.data?.concept, answer: obs?.data?.value })
            }))
        }
        return observations;
    }
    return Promise.resolve(null);
}

function getObs(path: string) {
    return openmrsFetch(`${BASE_WS_API_URL + path.split(BASE_WS_API_URL)[1]}?lang=${localStorage.i18nextLng}`, { method: 'GET' });
}
function checkUndefined(value) {
    return (value !== null && value !== undefined) ? value : "";
}

const formatResidence = (address, village, country) => {
    let residenceAddress = checkUndefined(address) !== "" ? address + ", " : "";
    let residenceVillage = checkUndefined(village) !== "" ? village + ", " : "";
    let residenceCountry = checkUndefined(country) !== "" ? country : "";
    return residenceAddress + residenceVillage + residenceCountry;
}
const formatAttribute = (item) => (
    item?.map((identifier) => {
        return {
            type: identifier.display.split(" = ")[0].trim(),
            value: identifier.display.split(" = ")[1].trim(),
        };
    })
);
const formatConcept = (concepts, uuid) => {
    let value;
    concepts?.map((concept) => (concept?.concept?.uuid == uuid) && (value = concept?.answer?.display))
    return value;
}

export async function getPatients(items) {
    return Promise.all(
        items.map(async (item) => {
            const relationships = await openmrsFetch(
                `${BASE_WS_API_URL}relationship?v=full&person=${item?.uuid}`,
                {
                    method: "GET",
                }
            )
            const Allconcept = await fetchObsByPatientAndEncounterType(item?.uuid, encounterTypeCheckIn);
            const attributs = formatAttribute(relationships?.data?.results?.[0]?.personA?.attributes);
            const personAttributes = formatAttribute(item?.person?.attributes);
            const identities = formatAttribute(item.identifiers);
            return {
                id: item?.uuid,

                identify: identities.find((identifier) => identifier.type == "CIN" || identifier.type == "NIF")?.value,

                No_dossier: item?.identifiers?.[0]?.identifier,

                firstName: item?.person?.names?.[0]?.familyName,

                lastName: item?.person?.names?.[0]?.givenName,

                birth: item?.person?.birthdate?.split("T")?.[0],

                residence:
                    formatResidence(
                        checkUndefined(item?.person?.addresses?.[0]?.display),
                        checkUndefined(item?.person?.addresses?.[0]?.cityVillage),
                        checkUndefined(item?.person?.addresses?.[0]?.country)
                    ),

                habitat: formatConcept(Allconcept, habitatConcept),

                phoneNumber: personAttributes.find(attribute => attribute.type == "Telephone Number")?.value,

                gender: item?.person?.gender,

                birthplace: personAttributes.find(attribute => attribute.type == "Birthplace")?.value,

                dead: item?.person?.dead,

                occupation: formatConcept(Allconcept, occupationConcept),

                matrimonial: formatConcept(Allconcept, maritalStatusConcept),

                deathDate: item?.person?.deathDate
            }
        }));
}