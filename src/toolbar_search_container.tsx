import React, { useState } from "react";
import styles from "./toolbar_search_container.scss";
import IconPlus from "@carbon/icons-react/es/add/20";
import SearchIcon from "@carbon/icons-react/es/search/20";
import RemoveIcon from "@carbon/icons-react/es/x-axis/20"
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { Delete } from '@carbon/pictograms-react';


export function SearchInput({ onChange, className }) {

    const [isActiveSearchIcon, setActiveSearchIcon] = useState(false);
    const [isActiveRemoveIcon, setActiveRemoveIcon] = useState(true);
    const [isClearInput, setActiveClearInput] = useState(true);
    const input = useRef(null)

    const toggleClass = (e) => {

        if (e.currentTarget.id == styles.removeIcon) {
            setActiveRemoveIcon(!isActiveRemoveIcon);
            setActiveSearchIcon(!isActiveSearchIcon);
            setActiveClearInput(!isClearInput);
            input.current.value = "";
        }
        if (e.currentTarget.id == "searchIcon") {
            input.current.focus();
        }
    };
    const onInputChange = (e) => {
        if (input.current.value.trim().length == 0) {
            setActiveRemoveIcon(true);
         setActiveSearchIcon(false);
         setActiveClearInput(false);
         }else{
           setActiveRemoveIcon(false);
           setActiveSearchIcon(true);
           setActiveClearInput(false);
         }
    }

    return <>
        <i className={styles.SearchIcon} >
          
            <SearchIcon
                id="searchIcon"
                className={isActiveSearchIcon ? styles["SearchIconChild"] : ''}
                onClick={toggleClass}
            />
            <Delete
                id={styles.removeIcon}
                onClick={toggleClass} 
                className={ isActiveRemoveIcon ? styles["SearchIconChild"] : '' }
            />
        </i>
        <input ref={input} type="text" className={className} name="search"
            onChange={onChange} onInput={onInputChange}
            placeholder="Search.." />
    </>

}

export function Toolbar_search_container({ onInputChange }) {
    return (
        <div className="bx--toolbar-search-container-persistent">
            <div data-search className={styles["bx--search"]} role="search">
                <div className={styles['bx--search-magnifier']}>
                    <div>
                        <svg focusable="false" preserveAspectRatio="xMidYMid meet" style={{ willChange: 'transform' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M15,14.3L10.7,10c1.9-2.3,1.6-5.8-0.7-7.7S4.2,0.7,2.3,3S0.7,8.8,3,10.7c2,1.7,5,1.7,7,0l4.3,4.3L15,14.3z M2,6.5 C2,4,4,2,6.5,2S11,4,11,6.5S9,11,6.5,11S2,9,2,6.5z">
                            </path>
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    )
}

export function Toolbar_Button({ onClickChange, label }) {
    return <>
        <button onClick={onClickChange} className={styles.Button}> <i><IconPlus /> </i> {label}</button>
    </>

}
