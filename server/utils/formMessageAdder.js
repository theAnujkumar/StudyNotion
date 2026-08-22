const messageFomatter = (fields) => {
    let nullFields = "";
    console.log(fields);
    for (const key in fields) {
        if (fields[key] === undefined || fields[key] === null || fields[key] === undefined) {
            nullFields += key + " ,";
        }
    }
    return nullFields;
}
module.exports = messageFomatter