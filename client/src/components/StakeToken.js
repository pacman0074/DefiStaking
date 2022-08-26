import React from "react";
import "../styles/StakeToken.css";

export default function STakeToken({accounts, contract, getRequireError}) {

    return(
        <div id="StakeToken-container">
            <span>Stake your ERC20 Token</span>
            <div id="StakeToken-stakeMenu"></div>
            <div id="StakeToken-statsMenu">
                <div></div>
                <div></div>
            </div>
        </div>
    )


}