const btnEncode2x2 = document.getElementById("2x2-Encode");
const btnEncode3x3 = document.getElementById("3x3-Encode");
const btnDecode2x2 = document.getElementById("2x2-Decode");
const btnDecode3x3 = document.getElementById("3x3-Decode");
const key = document.getElementById("key");
const btnGenerateKey = document.getElementsByClassName('generateKey');
const btnReset = document.getElementById('reset');

const listLetter = ['a', 'á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'b', 'c', 'd', 'đ', 'e',
                    'é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ', 'g', 'h', 'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị', 'k', 'l', 'm', 'n',
                    'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'p', 'q', 'r', 's', 't',
                    'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự', 'v', 'x', 'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', '_']

// utils
function removeSpacesAndTrim(inputString) {
    return inputString.trim().replace(/\s+/g, '').toLowerCase();
}

function formatOutputDecoder(inputString) {
    return inputString.replace(/_/g, '');
}

//Select a Massage to Encrypt 
function selectAMassageToEncode(plainText, size){
    let lengthOfPlainText = plainText.length;

    if (size == 2) {
        if (!(lengthOfPlainText % 2 == 0)) {
            plainText += '_';
        }
    }

    if (size == 3) {
        if ((lengthOfPlainText % 3) == 1) {
            plainText += '_' + '_';
        }
        else if ((lengthOfPlainText % 3) == 2) {
            plainText += '_';
        }
    }

    return plainText;
}

//Generate random key 
function generateKey(stringLenght){
    let randomString ='';
    for (let i = 0; i < stringLenght * stringLenght; i++){
        randomString += listLetter[Math.floor(Math.random() * (listLetter.length - 1))];
    }
    if (findModularMultiplicativeInverse(getDetMatrix(convertKeyToKeyMatrix(randomString, stringLenght), stringLenght)) == -1) return generateKey(stringLenght);
    return randomString;
}

//Get determinant of matrix 
function getDetMatrix(matrix, size){
    let detMatrix = 0;
    if (size == 2) {
        detMatrix = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % listLetter.length;
    }
    if (size == 3) {
        detMatrix = (matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
                - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
                + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])) % listLetter.length;
    }
    if (detMatrix < 0) detMatrix += listLetter.length;
    return detMatrix;
}

//Get transposaed matrix 
function getTransMatrix(matrix, size){
    for (let i = 0; i < size; i++){ // 0 0 1 0 - 0 1 ; 1 1; 2 0 - 0 2
        for (let j = 0; j < i; j++){
            if (!(i == j)){
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
}        }
    }
    return matrix;
}

//Get adjoint matrix
function getAdjMatrix(matrix, size){
    let adjMatrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    if (size == 2) {
        adjMatrix[0][0] = matrix[1][1];
        adjMatrix[0][1] = - matrix[0][1];
        adjMatrix[1][0] = - matrix[1][0];
        adjMatrix[1][1] = matrix[0][0];
    }
    if (size == 3) { 
        adjMatrix[0][0] = (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) % listLetter.length;
        adjMatrix[0][1] = - (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) % listLetter.length;
        adjMatrix[0][2] = (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) % listLetter.length;
        adjMatrix[1][0] = - (matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) % listLetter.length;
        adjMatrix[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) % listLetter.length;
        adjMatrix[1][2] = - (matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) % listLetter.length;
        adjMatrix[2][0] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) % listLetter.length;
        adjMatrix[2][1] = - (matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) % listLetter.length;
        adjMatrix[2][2] = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % listLetter.length;

        adjMatrix = getTransMatrix(adjMatrix, size);
    }
    return adjMatrix;
}

//Convert key to keyMatrix 
function convertKeyToKeyMatrix(key, size){
    let keyMatrix = [
        [], [], []
    ];
    let k = 0;
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            keyMatrix[i][j] = listLetter.findIndex((item) => item == key[k]);
            k++;
        };
    }
    return keyMatrix;
}

//Find Modular Multiplicative Inverse
function findModularMultiplicativeInverse(detMatrix){
    for (let i = 1; i < listLetter.length; i++){
        if ((detMatrix * i) % listLetter.length == 1) {
            return i;
        }
    }
    return -1;
}

//Convert keyMatrix to keyInvertMatrix 
function convertKeyMatrixToKeyInvertMatrix(keyMatrix, size){
    let detMatrix = getDetMatrix(keyMatrix, size);
    let adjMatrix = getAdjMatrix(keyMatrix, size);
    let modularMultiplicativeInverse = findModularMultiplicativeInverse(detMatrix);
    
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            adjMatrix[i][j] = (adjMatrix[i][j] * modularMultiplicativeInverse) % listLetter.length;
            if (adjMatrix[i][j] < 0) {adjMatrix[i][j] += listLetter.length}
        }
    }

    return adjMatrix;
}

//Convert massage to a N component vector 
function convertMassageToVector(plainText, size){ 
    plainText = selectAMassageToEncode(plainText, size);
    let lenghtOfPlainText = 0;
    for (let number of plainText) {
        lenghtOfPlainText++; 
    }
    let plainTextVector = [
        [], [], []
    ];
    let numChar = 0;
    if (size == 2) {
        for (let i = 0; i < lenghtOfPlainText; i += 2){ 
            for (let x = 0; x < size; x++){
                plainTextVector[x][i / size] = listLetter.findIndex((item) => item == plainText[numChar]);
                numChar++;
            }
        }
    }
    if (size == 3) {
        for (let i = 0; i < lenghtOfPlainText; i += 3){ 
            for (let x = 0; x < 3; x++){
                plainTextVector[x][i / 3] = listLetter.findIndex((item) => item == plainText[numChar]);
                numChar++;
            }
        }
    }
    return plainTextVector; 
}

//Get cipherMatrix
function getCipherMatrix(keyMatrix, plainTextVector, size, plainText){ 
    plainText = selectAMassageToEncode(plainText, size); 
    let lenghtOfPlainText = 0;
    for (let number of plainText) {
        lenghtOfPlainText++;
    }
    let numOfPlainTextVector = lenghtOfPlainText / size;
    let cipherMatrix = [
        [], [], []
    ];
    for (let j = 0; j < numOfPlainTextVector; j++){
        for (let i = 0; i < size; i++){
            cipherMatrix[i][j] = 0;
            for (let k = 0; k < size; k++){
                cipherMatrix[i][j] += keyMatrix[i][k] * plainTextVector[k][j];
            }
            cipherMatrix[i][j] = cipherMatrix[i][j] % listLetter.length;
        }
    }
    return cipherMatrix;
}

//Convert Cipher Matrix to Cipher Text 
function convertCipherMatrixToCipherText(cipherMatrix, size, plainText){
    let cipherText = '';
    plainText = selectAMassageToEncode(plainText, size);
    let lenghtOfPlainText = plainText.length;
    let numOfPlainTextVector = lenghtOfPlainText / size;
    for (let j = 0; j < numOfPlainTextVector; j++){
        for (let i = 0; i < size; i++){
            cipherText += listLetter.find((item) => item == listLetter[cipherMatrix[i][j]]);
        }
    }

    return cipherText;
}

//Get plainMatrix 
function getPlainMatrix(keyInvertMatrix, cipherTextVector, size, cipherText){
    return getCipherMatrix(keyInvertMatrix, cipherTextVector, size, cipherText);
}

//Get plainText
function convertPlainMatrixToPlainText(plainMatrix, size, cipherText){
    return convertCipherMatrixToCipherText(plainText, size, cipherText);
}

//Generate key
for (let number of btnGenerateKey) {
    number.addEventListener('click', function(){
        key.innerHTML = generateKey(number.value);
    });
}


//Encode 2x2
btnEncode2x2.addEventListener('click', function() {
    const plainText = document.getElementById("textEncode");
    const resultEncode = document.getElementById("resultEncode");
    const formattedPlainText = removeSpacesAndTrim(plainText.value);    
    let keyMatrix = convertKeyToKeyMatrix(key.innerHTML, btnEncode2x2.value);
    let plainTextVector = convertMassageToVector(formattedPlainText, btnEncode2x2.value);
    let cipherMatrix = getCipherMatrix(keyMatrix, plainTextVector, btnEncode2x2.value, formattedPlainText);
    let cipherText = convertCipherMatrixToCipherText(cipherMatrix, btnEncode2x2.value, formattedPlainText);
    resultEncode.innerHTML = cipherText; 
});

//Encode 3x3
btnEncode3x3.addEventListener('click', function() {
    const plainText = document.getElementById("textEncode");
    const resultEncode = document.getElementById("resultEncode");
    const formattedPlainText = removeSpacesAndTrim(plainText.value);
    let keyMatrix = convertKeyToKeyMatrix(key.innerHTML, btnEncode3x3.value);
    let plainTextVector = convertMassageToVector(formattedPlainText, btnEncode3x3.value);
    let cipherMatrix = getCipherMatrix(keyMatrix, plainTextVector, btnEncode3x3.value, formattedPlainText);
    let cipherText = convertCipherMatrixToCipherText(cipherMatrix, btnEncode3x3.value, formattedPlainText);
    resultEncode.innerHTML = cipherText;
})

//Decode 2x2
btnDecode2x2.addEventListener('click', function() {
    const cipherText = document.getElementById("textDecode");
    const resultDecode = document.getElementById("resultDecode");
    let keyMatrix = convertKeyToKeyMatrix(key.innerHTML, btnDecode2x2.value);
    let keyInvertMatrix = convertKeyMatrixToKeyInvertMatrix(keyMatrix, btnDecode2x2.value);
    let cipherTextVector = convertMassageToVector(cipherText.value.toLowerCase(), btnDecode2x2.value);
    let plainMatrix = getPlainMatrix(keyInvertMatrix, cipherTextVector, btnDecode2x2.value, cipherText.value.toLowerCase());
    let plainText = convertCipherMatrixToCipherText(plainMatrix, btnDecode2x2.value, cipherText.value.toLowerCase());
    resultDecode.innerHTML = formatOutputDecoder(plainText);
})

//Decode 3x3
btnDecode3x3.addEventListener('click', function() {
    const cipherText = document.getElementById("textDecode");
    const resultDecode = document.getElementById("resultDecode");
    let keyMatrix = convertKeyToKeyMatrix(key.innerHTML, btnDecode3x3.value);
    let keyInvertMatrix = convertKeyMatrixToKeyInvertMatrix(keyMatrix, btnDecode3x3.value);
    let cipherTextVector = convertMassageToVector(cipherText.value.toLowerCase(), btnDecode3x3.value);
    let plainMatrix = getPlainMatrix(keyInvertMatrix, cipherTextVector, btnDecode3x3.value, cipherText.value.toLowerCase());
    let plainText = convertCipherMatrixToCipherText(plainMatrix, btnDecode3x3.value, cipherText.value.toLowerCase());
    resultDecode.innerHTML = formatOutputDecoder(plainText);
})

btnReset.addEventListener('click', function() {
    const plainText = document.getElementById("textEncode");
    const resultEncode = document.getElementById("resultEncode");
    const cipherText = document.getElementById("textDecode");
    const resultDecode = document.getElementById("resultDecode");
    plainText.value = '';
    key.innerText = '';
    resultEncode.innerText = '';
    cipherText.value = '';
    resultDecode.innerText = '';
})