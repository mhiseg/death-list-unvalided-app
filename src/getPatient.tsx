function getPatients(items) {
    let patients = [];
    items.entry.forEach(function (item, i) {
        console.log(item)
        patients.push( {
            'id':item?.resource?.id,
            'No_dossier': item?.resource?.identifier[0]?.value,
            'firstName': item?.resource?.name[0]?.family,
            'lastName': item?.resource?.name[0]?.given[0],
            'birth': item?.resource?.birthDate,
            'residence': item?.resource?.address?.[0]?.country + ',' + item.resource?.address?.[0]?.city + ',' + item.resource?.address?.[0].extension[0]?.extension[0]?.valueString,
            'habitat': '',
            'gender': item?.resource?.gender,
            'occupation': '',
            'matrimonial': '',
            'deathDate': ''
        
    });
    });
    return patients;
} export default getPatients;

