import store from "@/store"
const institute = store.state.institute.institute
//:todo Purchase Record for compliance
export default class PurchaseRecord {
    constructor(data = {}) {
        this.id                     = data.id || ''
        this.type                   = data.type || 'purchase'
        this.monthlyReturnId        = data.monthlyReturnId || ''
        this.date                   = data.date || new Date().toISOString().substr(0, 10)
        this.description            = data.description || ''
        this.reference              = data.reference || ''
        this.monthOf                = data.monthOf || ''
        this.supplier               = data.supplier || {}
        this.totalVAT               = data.totalVAT || 0
        this.totalAmountInclusive   = data.totalAmountInclusive || 0
        this.totalAmountNetVat      = data.totalAmountNetVat || 0
        this.dataSource             = data.dataSource || {}
        this.status                 = data.status || 1
        this.itemLine               = data.itemLine || []
        this.dateFormat             = data.dateFormat || institute.dateFormat
        this.isSave                 = data.isSave
        this.decimalFormat          = data.decimalFormat || 'n2'
    }

    constuct(data) {
        this.constructor(data);
    }
}