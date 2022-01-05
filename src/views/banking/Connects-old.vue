<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <div class="function_wrapper">
                        <v-row>
                            <v-col sm="6" cols="12">
                                <v-card outlined dense class="block-gray">
                                    <h2>
                                        Keep your books accurate with automated connection with your bank
                                    </h2>
                                    <p>Connect your bank and we will bring in your transaction for you</p>
                                    <v-row>
                                        <v-col sm="2" cols="12" class="text-center pr-0">
                                            <h1 class="text-green">1</h1>
                                        </v-col>
                                        <v-col sm="10" cols="12" class="pl-0">
                                            Connect a bank or wallet to get started</v-col>
                                    </v-row>
                                    <v-row class="py-2">
                                        <v-col sm="2" cols="12" class="text-center pr-0">
                                            <h1 class="text-green">2</h1>
                                        </v-col>
                                        <v-col sm="10" cols="12" class="pl-0">
                                            Review and add your transactions
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col sm="12" cols="12" class="pb-0 pt-5">
                                            <v-btn width="100%" color="primary" class=" mb-4" link route to="connect_bank_account">
                                                <v-icon size="18" color="white" class="mr-3">fas fa-lock</v-icon>
                                                <span class="text-capitalize text-bold text-white">Connect bank account</span>
                                            </v-btn>
                                            <v-btn width="100%" color="white" class=" border-green">
                                                <span class="text-capitalize text-bold text-black">Upload transactions</span>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                            <v-col sm="6" cols="12">
                                <v-card outlined dense class="block-gray">
                                    <h2>
                                        Connect to our partners’ financial institutions
                                    </h2>
                                    <p>to automate your invoice collections, bill payment, and realtime reconciliation </p>
                                    <v-row>
                                        <v-col sm="4" cols="12" >
                                            <v-img width="70" class="mx-auto" src="@/assets/images/001.png" />
                                            <p class="text-center mt-2 mb-0">Payment with mobile money agents</p>
                                        </v-col>
                                        <v-col sm="4" cols="12" >
                                            <v-img width="70" class="mx-auto"  src="@/assets/images/002.png" />
                                            <p class="text-center mt-2 mb-0">Online payments</p>
                                        </v-col>
                                        <v-col sm="4" cols="12"  >
                                            <v-img width="70" class="mx-auto" src="@/assets/images/003.png" />
                                            <p class="text-center mt-2 mb-0">Proximity Payment</p>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col sm="12" cols="12" class="py-0">
                                            <v-btn width="100%" color="primary" class="" link route to="connect_payment_account">
                                                <v-icon size="18" color="white" class="mr-3">fas fa-lock</v-icon>
                                                <span class="text-capitalize text-bold text-white">Connect payment account</span>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    export default {
        name: '',
        components: {},
        data: () => ({}),
        methods: {},
        mounted() {
        },
    };
</script>
<style scoped>
    .block-gray{
        min-height: 388px;
    }
    .text-green{
        font-size: 35px !important;
    }
    @media (max-width: 576px) {

    }
</style>