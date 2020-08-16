const inventory = {
    "UK": {
        "Gloves": {
            pricePerUnit: 100,
            items: 100,
        },
        "Masks": {
            pricePerUnit: 65,
            items: 100,
        }
    },
    "Germany": {
        "Gloves": {
            pricePerUnit: 150,
            items: 50,
        },
        "Masks": {
            pricePerUnit: 100,
            items: 100,
        }
    }
}

let masksInventoryUsed = '';
let glovesInventoryUsed = '';
let priceMap;

function calculateTotalPrice(purchaseCountry, passportNo, noOfGloves, noOfMasks) {
    let totalPriceDomestic = 0;
    let totalPriceMasksInt = 0;
    let totalPriceGlovesInt = 0;
    let totalPriceInt = 0;
    let masksPrice = 0;
    let glovesPrice = 0;
    let finalPrice = 0;
    let data = 0;

    if ((noOfMasks > (inventory['UK'].Masks.items + inventory['Germany'].Masks.items)) ||
        (noOfGloves > (inventory['UK'].Gloves.items + inventory['Germany'].Gloves.items))) {
        finalPrice = "OUT_OF_STOCK";
        return data = [finalPrice, inventory['UK'].Gloves.items, inventory['UK'].Masks.items, inventory['Germany'].Gloves.items, inventory['Germany'].Masks.items];
    }

    if (noOfMasks <= inventory[purchaseCountry].Masks.items &&
        noOfGloves <= inventory[purchaseCountry].Gloves.items) {
        totalPriceDomestic = calculateDomesticPrice(purchaseCountry, noOfMasks, noOfGloves);

        priceMap = {
            d: totalPriceDomestic
        }

        finalPrice = calculateMinPrice(Object.values(priceMap));
    }

    if (noOfMasks > inventory[purchaseCountry].Masks.items &&
        noOfGloves <= inventory[purchaseCountry].Gloves.items) {
        totalPriceMasksInt = calculateMasksIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);
        totalPriceInt = calculateIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);

        priceMap = {
            mi: totalPriceMasksInt,
            i: totalPriceInt
        }

        finalPrice = calculateMinPrice(Object.values(priceMap));
    }

    if (noOfMasks <= inventory[purchaseCountry].Masks.items &&
        noOfGloves > inventory[purchaseCountry].Gloves.items) {
        totalPriceGlovesInt = calculateGlovesIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);
        totalPriceInt = calculateIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);

        priceMap = {
            gi: totalPriceGlovesInt,
            i: totalPriceInt
        }
        finalPrice = calculateMinPrice(Object.values(priceMap));
    }

    if (noOfMasks > inventory[purchaseCountry].Masks.items &&
        noOfGloves > inventory[purchaseCountry].Gloves.items) {
        totalPriceInt = calculateIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);

        finalPrice = totalPriceInt;
    }

    if (finalPrice > 0) {
        const inventoryKey = Object.keys(priceMap).find(key => priceMap[key] === finalPrice);

        if (inventoryKey === 'd') {
            inventory[purchaseCountry].Masks.items = inventory[purchaseCountry].Masks.items - noOfMasks;
            inventory[purchaseCountry].Gloves.items = inventory[purchaseCountry].Gloves.items - noOfGloves;
        }

        if (inventoryKey === 'mi') {
             if (purchaseCountry === 'UK') {
                 inventory['Germany'].Masks.items = inventory['Germany'].Masks.items - noOfMasks;
             } else {
                 inventory['UK'].Masks.items = inventory['UK'].Masks.items - noOfMasks;
             }
            inventory[purchaseCountry].Gloves.items = inventory[purchaseCountry].Gloves.items - noOfGloves;
        }

        if (inventoryKey === 'gi') {
            if (purchaseCountry === 'UK') {
                inventory['Germany'].Gloves.items = inventory['Germany'].Gloves.items - noOfGloves;
            } else {
                inventory['UK'].Gloves.items = inventory['UK'].Gloves.items - noOfGloves;
            }
            inventory[purchaseCountry].Masks.items = inventory[purchaseCountry].Masks.items - noOfMasks;
        }

        if (inventoryKey === 'i') {
            if (purchaseCountry === 'UK') {
                inventory['Germany'].Masks.items = inventory['Germany'].Masks.items - noOfMasks;
                inventory['Germany'].Gloves.items = inventory['Germany'].Gloves.items - noOfGloves;
            } else {
                inventory['UK'].Masks.items = inventory['UK'].Masks.items - noOfMasks;
                inventory['UK'].Gloves.items = inventory['UK'].Gloves.items - noOfGloves;
            }
            inventory[purchaseCountry].Masks.items = inventory[purchaseCountry].Masks.items - noOfMasks;
        }
    }

    return data = [finalPrice, inventory['UK'].Gloves.items, inventory['UK'].Masks.items, inventory['Germany'].Gloves.items, inventory['Germany'].Masks.items];
}


function calculateDomesticPrice(country, masks, gloves) {
    return (getMasksPriceByInventory(country, masks) +
        getGlovesPriceByInventory(country, gloves))
}

function calculateMasksIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    if (country === 'UK') {
        price = (getMasksPriceByInventory('Germany', masks) +
            getGlovesPriceByInventory(country, gloves));
    } else {
        price = (getMasksPriceByInventory('UK', masks) +
            getGlovesPriceByInventory(country, gloves));
    }
    let transportationCost = (masks / 10) * 400;
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}

function calculateGlovesIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    if (country === 'UK') {
        price = getMasksPriceByInventory(country, masks) +
            getGlovesPriceByInventory('Germany', gloves);
    } else {
        price = getMasksPriceByInventory(country, masks) +
            getGlovesPriceByInventory('UK', gloves);
    }
    let transportationCost = (gloves / 10) * 400;
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}

function calculateIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    if (country === 'UK') {
        price = getMasksPriceByInventory('Germany', masks) +
            getGlovesPriceByInventory('Germany', gloves);
    } else {
        price = getMasksPriceByInventory('UK', masks) +
            getGlovesPriceByInventory('UK', gloves);
    }
    let transportationCost = ((masks / 10) * 400) + ((gloves / 10) * 400);
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}

function calculateMinPrice(priceList) {
    const sortedPriceList = priceList.sort((a, b) => {
        return a - b;
    });

    return sortedPriceList[0];
}

function getMasksPriceByInventory(country, masks) {
    return (masks * inventory[country].Masks.pricePerUnit);
}

function getGlovesPriceByInventory(country, gloves) {
    return (gloves * inventory[country].Gloves.pricePerUnit);
}

function isDiscountApplicable(passportNo, purchaseCountry) {
    return valid = isPassportValid(purchaseCountry, passportNo);
}

function isPassportValid(country, passportNo) {
    if (country === "UK") {
        return /^[B][0-9]{3}[a-zA-z0-9]{7}/.test(passportNo);
    }
    else if (country === "Germany") {
       return /^[A][a-zA-Z]{2}[a-zA-Z0-9]{9}/.test(passportNo)
    }
}

module.exports = {
	calculateTotalPrice
};