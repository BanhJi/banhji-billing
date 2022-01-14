<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('dimension') }}</h2>
            <!-- level1 Main -->
            <v-dialog v-model="dialogM1" max-width="400px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" class=" text-capitalize white--text float-right" v-on="on"
                           @click="onNewLocation">
                        {{ $t('create_new') }}
                    </v-btn>
                </template>
                <v-card>
                    <div class="modal_header">
                        <v-card-title>{{ $t('location') }}</v-card-title>
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
                                        v-model="location.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="location.code"
                                        outlined
                                        :readonly="readonly"
                                        :rules="[v => !!v || $t('code_is_required')]"
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

            <!-- level2 Group-->
            <v-dialog v-model="dialogM2" max-width="400px">
                <v-card>
                    <div class="modal_header">
                        <v-card-title>{{ $t('sub_location') }}</v-card-title>
                        <v-icon class="btn_close" @click="dialogM2 = false">close</v-icon>
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
                                        v-model="location.name"
                                        outlined
                                        readonly
                                        required
                                        return-object/>
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="subLocation.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="subLocation.code"
                                        outlined
                                        :readonly="readonly"
                                        :rules="[v => !!v || $t('code_is_required'),v => (v && v.length > 2) || $t('character_3')]"
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
                                       @click="dialogM2 = false">{{ $t('cancel') }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn color="primary" class="px-3  white--text text-capitalize"
                                       @click="onSaveSubLocation">{{ $t('save_close') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>

            <!-- level3 Sub-->
            <v-dialog v-model="dialogM3" max-width="400px">
                <v-card>
                    <div class="modal_header">
                        <v-card-title>{{ $t('box') }}</v-card-title>
                        <v-icon class="btn_close" @click="dialogM3 = false">close</v-icon>
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
                                        v-model="subLocation.name"
                                        outlined
                                        readonly
                                        required/>
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="box.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="box.code"
                                        outlined
                                        :readonly="readonly"
                                        :rules="[v => !!v || $t('code_is_required'),v => (v && v.length > 2) || $t('character_3')]"
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
                                       @click="dialogM3 = false">{{ $t('cancel') }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn color="primary" class="px-3  white--text text-capitalize"
                                       @click="onSaveBox">{{ $t('save_close') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>

            <p class="mb-0">{{ $t('categories_desc') }} </p>
        </v-col>
        <v-col sm="12" cols="12" class="pt-0">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                type="loading"
                :myLoading="true"/>
            <treelistdatasource 
                ref="dimentsionsDS"
                :data="dimentsions"
                :schema-model="model"/>

            <treelist 
                ref="dimentsionsTreeList"
                data-source-ref="dimentsionsDS"
                :editable="true"
                :resizable="true"
                :column-menu="true"
                :columns="columns"
                :dataBound="onDataBound"/>
        </v-col>
    </v-row>
</template>

<script>
const billingSettingHandler = require("@/scripts/billingSettingHandler")
import kendo from "@progress/kendo-ui";
import LoadingMe from "@/components/Loading";
import { TreeList } from '@progress/kendo-treelist-vue-wrapper';
import { TreeListDataSource } from '@progress/kendo-datasource-vue-wrapper';
import {i18n} from '@/i18n'
export default {
    name: 'App',
    components: {
        'LoadingMe': LoadingMe,
        'treelist': TreeList,
        'treelistdatasource': TreeListDataSource,
    },
    data: function (){ 
        return {
            showLoading: false,
            dialogM1:    false,
            dialogM2:    false,
            dialogM3:    false,
            editable:    false,
            dimentsions: [],
            location: {
                id: '',
                name: '',
                code: '',
            },
            subLocation: {
                id: '',
                name: '',
                code: '',
            },
            box: {
                id: '',
                name: '',
                code: '',
            },
            valid: false,
            readonly: false,
            columns: [
                {
                    field:  "name",
                    title: i18n.t("name"),
                    editable: ()=>{return true},
                    width: 300,
                },
                {
                    field: "code",
                    title: i18n.t("code"),
                    editable: ()=>{return false},
                    width: 300,
                },
                {
                    title: i18n.t("action"),
                    command: [
                        {
                            name: "customedit",
                            text: "edit",
                            click: this.editChaild
                        },
                        {
                            name: "customadd",
                            text: "create",
                            click: this.addChaild
                        }
                    ],
                    width: 200,
                }
            ],
            model: {
                id: "id",
                expanded: true
            },
        }
    },
    methods: {
        onNewLocation(){
            window.console.log(0)
        },
        onSaveClose(){
            if (!this.$refs.form.validate()) {
                    this.$refs.form.validate()
                    return
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        "id":   this.location.id ? this.location.id : '',
                        "name": this.location.name,
                        "code": this.location.code
                    }
                    window.console.log('data',data)
                }, 300);
            })
        },
        editChaild(e){
            e.preventDefault();
            let treeList = this.$refs.dimentsionsTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            this.readonly = true
            if(dataItem.type =="location"){
                this.location = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.dialogM1 = true
            }else if(dataItem.type =="sub_location"){
                this.subLocation = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.location = {
                    id: dataItem.parentId,
                    name: dataItem.parentName,
                    code: dataItem.parentCode,
                }
                this.dialogM2 = true
            }else if(dataItem.type =="box"){
                this.subLocation = {
                    id:     dataItem.parentId,
                    name:   dataItem.parentName,
                    code:   dataItem.parentCode,
                }
                this.box = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.dialogM3 = true
            }
        },
        addChaild(e){
            e.preventDefault();
            let treeList = this.$refs.dimentsionsTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            this.readonly = false
            if(dataItem.type == "location"){
                this.location = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.subLocation = {
                    id: '',
                    name: '',
                    code: '',
                }
                this.dialogM2 = true
            }else if(dataItem.type =="sub_location"){
                this.subLocation = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.box = {
                    id: '',
                    name: '',
                    code: '',
                }
                this.dialogM3 = true
            }

        },
        onDataBound (e) {
            window.console.log(e.sender)
            var headers = e.sender.thead.children();
            for (var i = 0; i < headers.length; i++) {
                var th = kendo.jQuery(headers[i]);
                th.css("font-weight", "bold");
                th.css("text-align", "center");
            }

            var items = e.sender.items();
            for (var j = 0; j < items.length; j++) {
                var dataItem = e.sender.dataItem(items[j]);
                var row = kendo.jQuery(items[j]);

                /* Parent in bold */
                window.console.log(row.find("[data-command='customedit']"),'row.find', dataItem)
                if(dataItem.get("type") ===`box`){
                    // row.find("[data-command='customedit']").hide();
                    row.find("[data-command='customadd']").hide();
                    row.css("font-weight", "bold");
                }
            }
        },
        async loadDimension() {
            let param= {
                type: "location"
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    billingSettingHandler.getDimension(param).then(res => {
                        if(res.data.statusCode === 200){
                            window.console.log(res.data,11)
                            this.dimentsions = res.data.data
                        }
                        
                    })
                }, 300);
            })
        },
        onSaveSubLocation(){
            if (!this.$refs.form.validate()) {
                    this.$refs.form.validate()
                    return
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        id:               this.subLocation.id || "",
                        name:             this.subLocation.name,
                        code:             this.subLocation.code,
                        type:             "sub_location",
                        parentId:         this.location.id || "",
                        parentCode:       this.location.code || "",
                        parentName:       this.location.name || "",
                    }
                    billingSettingHandler.createSubLocation(data).then(res => {
                        if (res.data.statusCode === 201) {
                            this.dialogM2 = false
                            this.loadDimension()
                        }
                        
                    })
                    // createSubLocation
                    window.console.log('data',data)
                }, 300);
            })
        },
        onSaveBox(){
            if (!this.$refs.form.validate()) {
                    this.$refs.form.validate()
                    return
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        id:               this.box.id || "",
                        name:             this.box.name,
                        code:             this.box.code,
                        type:             "box",
                        parentId:         this.subLocation.id || "",
                        parentCode:       this.subLocation.code || "",
                        parentName:       this.subLocation.name || "",
                    }
                    window.console.log('data',data)
                    billingSettingHandler.createSubLocation(data).then(res => {
                        if (res.data.statusCode === 201) {
                            this.dialogM3 = false
                            this.loadDimension()
                        }
                        
                    })
                }, 300);
            })
        }
    },
    mounted: async function () {
        await this.loadDimension()
    }
}
</script>