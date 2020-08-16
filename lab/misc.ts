interface X {
    a: string;
}

const form: HTMLFormElement = {} as HTMLFormElement;

// -------- lab

type AB_intersection = A & B;

type StringConstr<constraint extends (val: string) => boolean> = string;
type NumberConstr<constraint extends (val: number) => boolean> = number;
type ObjectConstr<T extends object, constraint extends (val: T) => boolean> = T;

interface A {
    disc: "A";
    a: string;
}

interface B {
    disc: "B";
    b: number;
}

type AB_union = A | B;

function test(val: AB_union) {
    if (val.disc == "A") {
        val.a;
    } else {
        val.b;
    }
}

// ---------------
type RefinementFcn<T> = (val: T, result?: { msg: string }) => T | undefined;
type TypeRefinement<T, refinementFcn extends RefinementFcn<T>> = T & { refinementFcn?: refinementFcn };

// --------------- example: IsoDate
// https://www.regextester.com/96683    e.g. 1978-12-20

type IsoDate = TypeRefinement<string, typeof isIsoDate>;

const isIsoDate: RefinementFcn<string> = (val: string): IsoDate | undefined => {
    return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(val) ? (val as IsoDate) : undefined;
};

type MonthID = TypeRefinement<number, typeof isMonthID>;

const isMonthID: RefinementFcn<number> = (val: number): MonthID | undefined => {
    return 0 <= val && val < 12 ? (val as MonthID) : undefined;
};

let monthOK: MonthID = 1;
let isoTimeOk: IsoDate = "1978-12-20";

// monthOK = isoTimeOk;  // error: Type 'TypeRefinement<string, RefinementFcn<string>>' is not assignable to type 'number'.

// ----------------

interface IsoDate_refined {
    refinementFcn?: typeof isIsoDate;
}

interface MonthID_refined {
    refinementFcn?: typeof isMonthID;
}

let isoDate = {} as IsoDate_refined;

let monthID = {} as MonthID_refined;

// isoDate = monthID; //  ... Type 'TypeRefinement<string, RefinementFcn<string>>' is not assignable to type 'number'.

interface IOrganization {
    employeeCount: number;
    externalCount: number;
}

type Organization = TypeRefinement<IOrganization, typeof isValidOrganization>;
function isValidOrganization(val: IOrganization): Organization | undefined {
    return val.externalCount < val.employeeCount ? val : undefined;
}

const organization: Organization = {
    employeeCount: 20,
    externalCount: 5
};
