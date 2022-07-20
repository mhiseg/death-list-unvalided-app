import { openmrsFetch } from "@openmrs/esm-framework";
import { encounterTypeCheckIn, habitatConcept, maritalStatusConcept, occupationConcept } from "./constant";

const BASE_WS_API_URL = '/ws/rest/v1/';
export const BASE_FH_API_URL = "/ws/fhir2/R4/"
const toDay = new Date();

export async function getCurrentUserRoleSession() {
    let CurrentSession;
    await openmrsFetch(`${BASE_WS_API_URL}session`).then(data => { CurrentSession = data.data.user.systemId.split("-")[0] });
    return CurrentSession;
}

export function getAllPatientDeathPages(size: number, page: number) {
    return openmrsFetch(`${BASE_FH_API_URL}Patient?death-date=lt${toDay.toISOString()}&_count=${size}&_getpagesoffset=${page}`, {
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

export async function getPatients(items) {
    let patients;


    function checkUndefined(value) {
        return (value !== null && value !== undefined) ? value : "";
    }
    const formatAttribute = (item) =>
        item?.map((identifier) => {
            return {
                type: identifier.type.text,
                value: identifier.value,
            };
        });
    const formatValided = (item) => {
        let formated = false;
        console.log(item,'_+_+_+_+_+');
        // item?.map(function (element) {
        //     if (element?.attributeType?.display === "Death Validated") {
        //         return (element?.attributeType?.display === "Death Validated")
        //             ? formated = true : formated = false
        //     }
        // })
        return "";
    }

    const formatConcept = (concepts, uuid) => {
        let value;
        concepts?.map((concept) => (concept?.concept?.uuid == uuid) && (value = concept?.answer?.display))
        return value;
    }

    const formatResidence = (address, village, country) => {
        let residenceAddress = checkUndefined(address) !== "" ? address + ", " : "";
        let residenceVillage = checkUndefined(village) !== "" ? village + ", " : "";
        let residenceCountry = checkUndefined(country) !== "" ? country : "";
        return residenceAddress + residenceVillage + residenceCountry;
    }
    if (items) {
        patients = Promise.all(
            items.entry.map(async function (item) {

                const Allconcept = await fetchObsByPatientAndEncounterType(item?.resource?.id, encounterTypeCheckIn);
                const identities = formatAttribute(item?.resource?.identifier);
                return {
                    id: item?.resource?.id,

                    identify: identities.find((identifier) => identifier.type == "CIN" || identifier.type == "NIF")?.value,

                    No_dossier: item?.resource?.identifier?.[0]?.value,

                    firstName: item?.resource?.name[0]?.family,

                    lastName: item?.resource?.name[0]?.given[0],

                    birth: item?.resource?.birthDate,

                    residence:
                        formatResidence(
                            checkUndefined(item.resource?.address?.[0].extension?.[0]?.extension?.[0]?.valueString),
                            checkUndefined(item.resource?.address?.[0]?.city),
                            checkUndefined(item?.resource?.address?.[0]?.country)
                        ),

                    habitat: formatConcept(Allconcept, habitatConcept),

                    gender: item?.resource?.gender,

                    occupation: formatConcept(Allconcept, occupationConcept),

                    matrimonial: formatConcept(Allconcept, maritalStatusConcept),

                    deathDate: item?.resource?.deceasedDateTime,

                    valided: formatValided(item?.resource)

                }
            })
        );
    }
    return patients;
}