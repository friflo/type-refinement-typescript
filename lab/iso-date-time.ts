type IsoDateTime = TypeRefinement<string, typeof isIsoDateTime>;

function isIsoDateTime(val: string): IsoDateTime | undefined {
    const regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
    return regex.test(val) ? (val as IsoDateTime) : undefined;
}

const isoDateOk: IsoDateTime = "2020-08-16T13:57:12.123Z"; // OK
const isoDateErr: IsoDateTime = "16/8/2020"; // type refinement 'IsoDateTime' violates 'isIsoDateTime()'

function testDateTime(val: string) {
    if (isIsoDateTime(val)) {
        val; //  refines to IsoDateTime if type refinement is enabled; Otherwise string
    } else {
        const dst: IsoDateTime = val; // is always string; with refinement - error: Type 'string' is not assignable to type 'IsoDateTime'.
    }
}
