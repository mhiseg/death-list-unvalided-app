
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