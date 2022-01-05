<template>
    <v-row>
        <v-col sm="6" cols="12">
            <v-card outlined dense class="block-gray">
                <p class="mb-0">
                     {{$t('current_bank_mfis')}} <br> {{$t('that_connect_with')}}:
                </p>
                <v-row>
                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="100" class="mx-auto" src="@/assets/images/amret.png" />
                        </v-card>
                    </v-col>

                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="120" class="mx-auto" src="@/assets/images/sathapana_bank.png" />
                        </v-card>
                    </v-col>
                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="100" class="mx-auto" src="@/assets/images/acleda.jpg" />
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="100" class="mx-auto" src="@/assets/images/emoney.png" />
                        </v-card>
                    </v-col>

                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="120" class="mx-auto" src="@/assets/images/aba1.png" />
                        </v-card>
                    </v-col>
                    <v-col sm="4" cols="12">
                        <v-card outlined dense class="box-insight pa-5" style="min-height: 176px">
                            <v-img width="100" class="mx-auto" src="@/assets/images/payon.jpeg" />
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col sm="6" cols="12">
            <v-card outlined dense class="block-gray">
                <h2>
                   {{$t('connect_dashboard_title_right')}}
                </h2>
                <p>{{$t('connect_dashboard_desc_right')}}</p>
                <v-row>
                    <v-col sm="4" cols="12" >
                        <v-img width="70" class="mx-auto" src="@/assets/images/001.png" />
                        <p class="text-center mt-2 mb-0">{{$t('payment_with_mobile')}}</p>
                    </v-col>
                    <v-col sm="4" cols="12" >
                        <v-img width="70" class="mx-auto"  src="@/assets/images/002.png" />
                        <p class="text-center mt-2 mb-0">{{$t('online_payments')}}</p>
                    </v-col>
                    <v-col sm="4" cols="12"  >
                        <v-img width="70" class="mx-auto" src="@/assets/images/003.png" />
                        <p class="text-center mt-2 mb-0">{{$t('proximity_payment')}}</p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col sm="12" cols="12" class="py-0">
                        <v-btn width="100%" color="primary" class="" link route to="connect_payment_account">
                            <v-icon size="18" color="white" class="mr-3">fas fa-lock</v-icon>
                            <span class="text-capitalize text-bold text-white">{{$t('connect_payment_account')}}</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>

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