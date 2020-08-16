//

// --- lib.*.d.ts - predefined type refinement types

/**
 * A type refinement function is used as a validation function inside a TypeRefinement. Its signature is:
 *
 *     (val: <base type>) => <refined type> | undefined
 *
 * @result { msg: string }) - May be used to return a descriptive validation error
 */
type RefinementFcn<T> = (val: T, result?: { msg: string }) => T | undefined;

/**
 * TypeRefinement defines a refined type by creating a bi-directional relation of the refined type (MyType)
 * and its refinement function (isMyType). E.g. MyType <-> isMyType
 *
 *    function isMyType(val: string): MyType { return <MyType constraints fulfilled> ? val : undefined; }
 *    type MyType = TypeRefinement<string, typeof isMyType>;
 *
 * In case type refinement is enabled typeof inside a TypeRefinement create the described relation above.
 * When using refined types in code it enables:
 * - Execute refinementFcn to validate refined type for literals.
 * - Refine a type when calling the refinementFcn() with the given base type T.
 *
 * Current compilers without refinement support simply use the given base type T.
 */
type TypeRefinement<T, refinementFcn extends RefinementFcn<T>> = T;

//
// --------------- example: IsoTime
// https://www.regextester.com/104042   e.g. 13:00

type IsoTime = TypeRefinement<string, typeof isIsoTime>;

function isIsoTime(val: string): IsoTime | undefined {
    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val) ? val : undefined;
}

const isoTimeOk: IsoTime = "08:15"; // OK
const isoTimeEr: IsoTime = "abc"; // error: type refinement 'IsoTime' violates 'isIsoTime()'

function testIsoTime(val: string) {
    if (isIsoTime(val)) {
        val; //  refines to IsoTime if type refinement is enabled; Otherwise string
    } else {
        const dst: IsoTime = val; // is always string; error: Type 'string' is not assignable to type 'IsoTime'.
    }
}

//
// --------------- example: MonthID
type MonthID = TypeRefinement<number, typeof isMonthID>;

function isMonthID(val: number): MonthID | undefined {
    return 0 <= val && val < 12 ? val : undefined;
}

const monthOK: MonthID = 1; // OK
const monthErr: MonthID = 13; // error: type refinement 'MonthID' violates 'isMonthID()'

//
// --------------- example: MenuItem
type MenuItem = TypeRefinement<IMenuItem, typeof isMenuItem>;

export interface IMenuItem {
    component?: object;
    click?: () => void;
}

function isMenuItem(val: IMenuItem): MenuItem | undefined {
    return !val.component != !val.click ? val : undefined; // Ensures either component or click is set
}

const menuItemErr: MenuItem = {
    component: {},
    click: () => {}
}; // error: type refinement 'MenuItem' violates 'isMenuItem()'

//
// --------------- example: Employee
export interface Employee {
    name: string;
    reports: Employee[];
    budget?: number;
}

type Supervisor = TypeRefinement<Employee, typeof isSupervisor>;
type Manager = TypeRefinement<Employee, typeof isManager>;

function isSupervisor(val: Employee): Supervisor | undefined {
    return val.reports.length > 0 ? val : undefined;
}

function isManager(val: Employee): Manager | undefined {
    return val.budget ? val : undefined;
}

const supervisorErr: Supervisor = {
    name: "John",
    reports: []
}; // error: type refinement 'Supervisor' violates 'isSupervisor()'

function testEmployee(val: Employee) {
    if (isManager(val)) {
        val; // refines to Manager if type refinement is enabled; Otherwise Employee
    } else {
        const dst: Manager = val; // val is always Employee; error: Type 'Employee' is not assignable to type 'Manager'.
    }
}

//
// --------------- example: use refined typed as properties
// Example class hosting some constrained types and fallback to base type T with current compilers
interface Test {
    time: IsoTime;
    date: IsoDate;
    month: MonthID;
    menuItem: MenuItem;
    manager: Supervisor | Manager;
}
