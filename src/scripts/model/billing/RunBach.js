export default class RunBach {
    constructor(data = {}) {
        this.transactionDate        = data.transactionDate || new Date().toISOString().substr(0, 10)
        this.priceLevel             = data.priceLevel || {}
        this.transactionType        = data.transactionType || {}
        this.paymentTerm            = data.paymentTerm || {}
        this.dueDate                = data.dueDate || new Date().toISOString().substr(0, 10)
        this.segment                = data.segment || {}
        this.priceLevel             = data.priceLevel || {}
        this.lateFee                = data.lateFee || {}
        this.location               = data.location || {}
        this.txnRate                = data.txnRate || ''
        this.exchangeRate           = data.exchangeRate || ''
        this.number                 = data.number || ''
        this.monthOf                = data.monthOf || ''
        this.invoice                = data.invoice
    }
    constuct(data) {
        this.constructor(data);
    }
}