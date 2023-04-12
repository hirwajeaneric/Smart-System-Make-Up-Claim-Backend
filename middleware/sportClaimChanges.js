    // Comparing function to spot changes in claim.
    function getChangedValues(obj1, obj2) {
        let changes = {};
        for (let prop in obj2) {
            if (typeof obj2[prop] === "object" && obj2[prop] !== null) {
                let nestedChanges = getChangedValues(obj1[prop], obj2[prop]);
                if (Object.keys(nestedChanges).length > 0) {
                changes[prop] = nestedChanges;
                }
            } else if (!Object.is(obj1[prop], obj2[prop])) {
                changes[prop] = obj2[prop];
            }
        }
        return changes;
    }

    module.exports = getChangedValues;