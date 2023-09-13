function checkValidVersionNum(n) {
    if (isNaN(n)) {
        throw new Error('Invalid version');
    }
}

class Version {
    constructor(version) {
        const versionArray = version.split('.');
        if (versionArray.length !== 3) {
            throw new Error('Invalid version');
        }
        this.major = Number(versionArray[0]);
        checkValidVersionNum(this.major);
        this.minor = Number(versionArray[1]);
        checkValidVersionNum(this.minor);
        this.patch = Number(versionArray[2]);
        checkValidVersionNum(this.patch);
    }

    compare(version) {
        const major = this.major - version.major;
        const minor = this.minor - version.minor;
        const patch = this.patch - version.patch;
        if (major > 0) {
            return 1;
        } else if (major < 0) {
            return -1;
        } else {
            if (minor > 0) {
                return 1;
            } else if (minor < 0) {
                return -1;
            } else {
                if (patch > 0) {
                    return 1;
                } else if (patch < 0) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    }

    isLessThan(versionStr) {
        const version = new Version(versionStr);
        return this.compare(version) === -1;
    }
}

module.exports = Version;
