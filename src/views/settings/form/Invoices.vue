<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <v-tabs>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('invoice') }}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('commercial_invoice') }}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('tax_invoice') }}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('tax_invoice') }} 2
                    </span>
                </v-tab>
                <!-- <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down">
                        Banhji Invoice {{instituteId}}
                    </span>
                </v-tab> -->
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <DefaultInvoice/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text class="">
                            <CommercialInvoice/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text >
                            <TaxInvoice />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <TaxInvoice2 />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <!-- <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <BanhjiInvoice />
                        </v-card-text>
                    </v-card>
                </v-tab-item> -->
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script>
/* Cookie */
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();

export default {
    name: "CustomerDeposit",
    components: {
        DefaultInvoice: () => import('./DefaultInvoice'),
        TaxInvoice: () => import('./taxInvoice'),
        CommercialInvoice: () => import('./CommercialInvoice'),
        TaxInvoice2: ()=> import('./taxInvoice2'),
        // BanhjiInvoice: () =>import('./BanhjiInvoice')
    },
    data: () => ({}),
    watch: {},
    methods: {
        clickMe(data) {
            this.$route.push(data.link);
        }
    },
    computed: {
        instituteId() {
            return cookie.instituteId;
        },
  },
};
</script>
<style scoped>
/* .v-menu__content{
  top: 141px !important;
  left: 1098px !important;
} */
.v-menu__content .v-list .v-list-item {
    min-height: 35px !important;
}

.tab_wrapper {
    position: relative;
    display: inherit;
}

.v-tab {
    min-width: 30px;
    font-size: 17px;
    text-transform: capitalize;
}

.v-icon--left {
    margin-right: 0px;
}

.theme--light.v-tabs > .v-tabs-bar {
    border-bottom: 1px solid #ddd !important;
}

.menuable__content__active {
    left: 448px !important;
}



.v-tab--active {
    background-color: #E5EFFA;
    color: #000;
}

.theme--light.v-tabs >>> .v-tabs-bar {
    border-bottom: 1px solid #ddd !important;
}

.v-card__text {
    padding: 0 !important;
}
</style>
	