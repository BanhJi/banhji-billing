export default class Contract {
    constructor(data = {}) {
        this.transactionDate        = data.transactionDate || new Date().toISOString().substr(0, 10)
        this.customer               = data.customer || ''
        this.abbr                   = data.abbr || ''
        this.number                 = data.number || ''
        this.contractLevel          = data.contractLevel ||  ''
        this.priceLevel             = data.priceLevel || ''
        this.receivableAcc          = data.receivableAcc || "" //{}
        this.location               = data.location || "" //{}
        this.subLocation            = data.subLocation ||""
        this.box                    = data.box || "" //{}
        this.country                = data.country || "" //{}
        this.province               = data.province || "" //{}
        this.district               = data.district || "" // {}
        this.commune                = data.commune || "" // {}
        this.village                = data.village || "" // {}
        this.invoice                = data.invoice || {}
        this.invoiceId              = data.invoiceId || {}
    }
    constuct(data) {
        this.constructor(data);
    }
}