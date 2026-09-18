export type { CertificateCreateResponse } from './api'
export { ApplicationCreated } from './ui/application-created'
export { CreateCertificateForm } from './ui/create-certificate-form'
export { EditCertificateForm } from './ui/edit-certificate-form'
export { ExtraDataList } from './ui/extra-data-list'
// Quyidagilar formaning ko'rinishini admin uchun qayta chizishga kerak
// (Formalar sahifasidagi "Formani ko'rish" tabi) — nomzod ko'rgan forma bilan
// bir xil bo'lishi uchun aynan shu komponentlar ishlatiladi.
export { CustomFields } from './ui/custom-fields'
export { FormSection } from './ui/form-section'
export { ScoreFields } from './ui/score-fields'
export { getCustomFields, getCoreRule, getScoreFields } from './model/type-form'
