export type Gender = "MALE" | "FEMALE";

export type Member = {
    id: number,
    firstName: string,
    lastName: string,
    gender: Gender,
    birthDate: Date,
    height: number,
    weight: number,
    docType: string,
    docNumber: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date
}