<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="font_20">{{ $t('contract_level') }}</h2>
            <!-- dialogM1 Tariff -->
            <v-dialog v-model="dialogM1" max-width="400px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" class=" text-capitalize white--text float-right" v-on="on">
                        {{ $t('create_new') }}
                    </v-btn>
                </template>
                <v-card>
                    <div class="modal_header">
                        <v-card-title>{{ $t('contract_level') }}</v-card-title>
                        <v-icon class="btn_close" @click="dialogM1 = false">close</v-icon>
                    </div>
                    <v-card-text class="modal_text_content">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation>
                            <v-row>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="contractLevel.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required')]"
                                        required
                                        placeholder=""/>
                                    <label class="label">{{ $t('abbr *') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="contractLevel.abbr"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required')]"
                                        required
                                        placeholder=""/>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="modal_footer">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn color="primary" outlined
                                       class=" text-capitalize  black--text float-left"
                                       @click="dialogM1 = false">{{ $t('cancel') }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn color="primary" class="px-3  white--text text-capitalize"
                                       @click="onSaveClose">{{ $t('save_close') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>
        </v-col>
        <v-col sm="12" cols="12" class="pt-0">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                type="loading"
                :myLoading="true"/>
            <kendo-datasource ref="exemptionDS"
                :data="exemptions"/>
                <kendo-grid id="gridexamption" class="grid-function"
                    ref="exemption"
                    :data-source-ref="'exemptionDS'"
                    :editable="false">
                    <kendo-grid-column
                        :width="200"
                        :field="'name'"
                        :title="$t('name')"
                        :template="'<span>#= name#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                    <kendo-grid-column
                        :width="200"
                        :field="'abbr'"
                        :title="$t('abbr')"
                        :template="'<span>#= abbr#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                </kendo-grid>
        </v-col>
    </v-row>
</template>

<script>
import LoadingMe from "@/components/Loading";
// import kendo from "@progress/kendo-ui";
// import {i18n} from '@/i18n'
const billingSettingHandler = require("@/scripts/billingSettingHandler")

export default {
    props: {},
    components: {
        'LoadingMe': LoadingMe
    },
    data: function (){ 
        return {
            showLoading: false,
            dialogM1: false,
            exemptions: [{name: "E1", abbr: "GCL"}],
            valid: false,
            contractLevel: {
                id: '',
                name: '',
                abbr: '',
            },
        }
    },
    methods: {
        onSaveClose(){
            if (!this.$refs.form.validate()) {
                    this.$refs.form.validate()
                    return
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        id:               this.contractLevel.id || "",
                        name:             this.contractLevel.name,
                        code:             this.contractLevel.abbr,
                    }
                    billingSettingHandler.createContractLevel(data).then(res => {
                        if (res.data.statusCode === 201) {
                            this.dialogM1 = false
                            this.loadDimension()
                        }
                        
                    })
                    // createSubLocation
                    window.console.log('data',data)
                }, 300);
            })
        },

    },
    computed: {
    },
    async mounted() {
        await this.loadProducts()
    },
    watch: {},
};
</script>