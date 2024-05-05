
import React from 'react'
import bmcImage from "../img/bmc-button.png"

const BuyMeACoffee: React.FC = () =>{


    return(
        <div>
            <a href='https://www.buymeacoffee.com/nigelbess'  target='_blank' rel="noreferrer">
                <img alt = "Buy Me A Coffee" src={bmcImage} className="CoffeeButtonImage Shadow">
                </img>

            </a>
        </div>
    )


}
export default BuyMeACoffee