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

        finalPrice = totalPriceDomestic;
    }

    if (noOfMasks > inventory[purchaseCountry].Masks.items &&
        noOfGloves <= inventory[purchaseCountry].Gloves.items) {
        totalPriceMasksInt = calculateMasksIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);


        finalPrice = totalPriceMasksInt;
    }

    if (noOfMasks <= inventory[purchaseCountry].Masks.items &&
        noOfGloves > inventory[purchaseCountry].Gloves.items) {
        totalPriceGlovesInt = calculateGlovesIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);

        finalPrice = totalPriceGlovesInt;
    }

    if (noOfMasks > inventory[purchaseCountry].Masks.items &&
        noOfGloves > inventory[purchaseCountry].Gloves.items) {
        totalPriceInt = calculateIntPrice(purchaseCountry, noOfMasks, noOfGloves, passportNo);

        finalPrice = totalPriceInt;
    }


    return data = [finalPrice, inventory['UK'].Gloves.items, inventory['UK'].Masks.items, inventory['Germany'].Gloves.items, inventory['Germany'].Masks.items];
}


function calculateDomesticPrice(country, masks, gloves) {
    return (getMasksPriceByInventory(country, masks) +
        getGlovesPriceByInventory(country, gloves))
}

function calculateMasksIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    let remaining = masks - inventory[country].Masks.items;
    if (country === 'UK') {
        price = (getMasksPriceByInventory('Germany', remaining) +
            getMasksPriceByInventory(country, inventory[country].Masks.items) +
            getGlovesPriceByInventory(country, gloves));
    } else {
        price = (getMasksPriceByInventory('UK', remaining) +
            getMasksPriceByInventory(country, inventory[country].Masks.items) +
            getGlovesPriceByInventory(country, gloves));
    }
    let transportationCost = (remaining / 10) * 400;
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}

function calculateGlovesIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    let remaining = gloves - inventory[country].Gloves.items;
    if (country === 'UK') {
        price = getMasksPriceByInventory(country, masks) +
            getGlovesPriceByInventory(country, inventory[country].Gloves.items) +
            getGlovesPriceByInventory('Germany', remaining);
    } else {
        price = getMasksPriceByInventory(country, masks) +
            getGlovesPriceByInventory(country, inventory[country].Gloves.items) +
            getGlovesPriceByInventory('UK', remaining);
    }
    let transportationCost = (remaining / 10) * 400;
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}

function calculateIntPrice (country, masks, gloves, passportNo) {
    let price = 0;
    let remainingMask = masks - inventory[country].Masks.items;
    let remainingGloves = gloves - inventory[country].Gloves.items;

    if (country === 'UK') {
        price = getMasksPriceByInventory('Germany', remainingMask) +
            getGlovesPriceByInventory('Germany', remainingGloves) +
            getMasksPriceByInventory(country, inventory[country].Masks.item) +
            getGlovesPriceByInventory(country, inventory[country].Gloves.items);
    } else {
        price = getMasksPriceByInventory('UK', remainingMask) +
            getGlovesPriceByInventory('UK', remainingGloves) +
            getMasksPriceByInventory(country, inventory[country].Masks.items) +
            getGlovesPriceByInventory(country, inventory[country].Gloves.items);
    }
    let transportationCost = ((remainingMask / 10) * 400) + ((remainingGloves / 10) * 400);
    if (isDiscountApplicable(country, passportNo)) {
        transportationCost = transportationCost - (transportationCost / 5);
    }
    return price + transportationCost;
}


function getMasksPriceByInventory(country, masks) {
    inventory[country].Masks.items = inventory[country].Masks.items - masks;
    return (masks * inventory[country].Masks.pricePerUnit);
}

function getGlovesPriceByInventory(country, gloves) {
    inventory[country].Gloves.items = inventory[country].Gloves.items - gloves;
    return (gloves * inventory[country].Gloves.pricePerUnit);
}

function isDiscountApplicable(purchaseCountry, passportNo) {
    return valid = isPassportValid(purchaseCountry, passportNo);
}

function isPassportValid(country, passportNo) {
    if (country === "Germany") {
        return /^[B][0-9]{3}[a-zA-z0-9]{7}/.test(passportNo);
    }
    else if (country === "UK") {
       return /^[A][a-zA-Z]{2}[a-zA-Z0-9]{9}/.test(passportNo)
    }
}

module.exports = {
	calculateTotalPrice
};