import Tesseract from "tesseract.js";

export const extractTextFromImage = async (imageFile) => {
    try {
        const result = await Tesseract.recognize(
            imageFile,
            "nep",
            {
                // logger: info => console.log(info)
            }
        );

        const voterId = extractVoterIdFromText(result.data.text);

        return voterId;
    } catch (error) {
        throw new Error("Text extraction failed");
    }
};

const convertNepaliNumbers = (nepaliNumber) => {
    const nepaliNumbers = {
        "०": "0",
        "१": "1",
        "२": "2",
        "३": "3",
        "४": "4",
        "५": "5",
        "६": "6",
        "७": "7",
        "८": "8",
        "९": "9"
    };

    return nepaliNumber.split('').map(char => nepaliNumbers[char] || char).join('');
};

export const extractVoterIdFromText = (text) => {
    const voterIdRegex = /मतदाता\s*नम्बर\s*[:\s]*([\u0966-\u096F\s]+)/i;
    const match = text.match(voterIdRegex);

    if (match) {
        let nepaliNumber = match[1].trim();
        return convertNepaliNumbers(nepaliNumber);
    }

    return "Not found";
};
