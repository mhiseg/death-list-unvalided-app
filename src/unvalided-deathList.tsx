
import React from "react";
import styles from "./unvalided-death.scss";
import { useTranslation } from "react-i18next";


import DeathList from "./deathList";


const UnvalidedDeathList: React.FC = () => {
  let tableTitle = 'Liste des morts non validés';
  const { t } = useTranslation();
 
  let headers = [
    {
      key: 'No_dossier',
      header: t('No dossier')
    },
    {
      key: 'firstName',
      header: 'Nom'
    },
    {
      key: 'lastName',
      header: 'Prenom'
    },
    {
      key: 'birth',
      header: 'Date de naisssance'

    },
    {
      key: 'gender',
      header: 'sexe'
    },
    {
      key: 'habitat',
      header: 'Habitat'
    },
    {
      key: 'residence',
      header: 'Residence'
    },
    {
      key: 'occupation',
      header: 'Occupation'
    },
    {
      key: 'etat_civil',
      header: 'Etat civil'
    },
    {
      key: 'deathDay',
      header: 'Date de déces'
    }

  ];
  const rows = [
    {
      id: '0',
      No_dossier: '10',
      prenom: 'Esther',
      nom: 'Jean',
      bith: '10-09-1997',
      gender: 'Masculin',
      habitat: 'Urbain',
      residence: '775 Rolling G',
      occupation: 'Nurse',
      etat_civil: 'Divorcé',
      deathDay: 'Mon, 5/25/19, 2:53:37 PM'
    }, {
      id: '1',
      No_dossier: '11',
      prenom: 'Charles',
      nom: 'Mitchelene',
      bith: '12-07-1999',
      gender: 'Masculin',
      habitat: 'Urbain',
      residence: '875 Rolling G',
      occupation: 'Nurse',
      etat_civil: 'Marié',
      deathDay: 'Mon, 5/25/19, 2:53:37 PM'
    }, {
      id: '2',
      No_dossier: '12',
      prenom: 'Charlagne',
      nom: 'Peraltre',
      bith: '12-07-1999',
      gender: 'Masculin',
      habitat: 'Urbain',
      residence: '875 Rolling G',
      occupation: 'Nurse',
      etat_civil: 'Marié',
      deathDay: 'Mon, 5/25/19, 2:53:37 PM'
    }];
    
  return (
    <div className={styles.container}>

      <section>
        <h5> {t('list label')}</h5>
       <DeathList  headers={headers}/>
      </section >
    </div >
  );
};

export default UnvalidedDeathList;