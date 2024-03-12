import moment from "moment";
export class CommonUtils {
    static getRangeYear(startYear) {
        const listYear = [];
        const currentYear = moment().year();
        startYear = startYear || 1975;
        while(startYear < currentYear) {
            listYear.push({ year: ++startYear });
        }
        return listYear;
    }

    static getRangeBirthYearCustom(startYear) {
        const listYear = [];
        const currentYear = moment().year();
        startYear = startYear || 1975;
        while (startYear < currentYear) {
            const data = ++startYear;
            listYear.push({
                value: data,
                label: data + ''
            });
        }
        return listYear;
    }
}