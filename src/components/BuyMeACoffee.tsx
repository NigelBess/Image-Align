
import React from 'react'
import bmcImage from "../img/bmc-button.png"

const BuyMeACoffee: React.FC = () =>{


    return(
        <div>
            <a href='https://www.buymeacoffee.com/nigelbess'  target='_blank'>
                <img alt = "Buy Me A Coffee" src={bmcImage} className="CoffeeButtonImage">
                </img>

            </a>
        </div>
    )


}
export default BuyMeACoffee