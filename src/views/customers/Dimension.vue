<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('Locations') }}</h2>
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
                        <v-card-title>{{ $t('level1') }}</v-card-title>
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
                                        v-model="main.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="main.code"
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
                        <v-card-title>{{ $t('level1') }}</v-card-title>
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
                                        v-model="main.name"
                                        outlined
                                        readonly
                                        required/>
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="group.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="group.code"
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
                                       @click="onSaveClose">{{ $t('save_close') }}
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
                        <v-card-title>{{ $t('level1') }}</v-card-title>
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
                                        v-model="group.name"
                                        outlined
                                        readonly
                                        required/>
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="sub.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                        required
                                                  placeholder=""/>
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="sub.code"
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
                                       @click="onSaveClose">{{ $t('save_close') }}
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
            dimentsions: [
                {id: 'mab-uuid-001',    parentId: null,           parentCode: null, parentName: null, type:"main",   name: "A01", code: "A01"},
                {id: 'mab-uuid-002',    parentId: 'mab-uuid-001', parentCode:"A01", parentName: "A01", type:"group",   name: "S01", code: "S01"},
                {id: 'mab-uuid-003',    parentId: 'mab-uuid-002', parentCode:"SO1", parentName: "S01", type:"sub",   name: "B01", code: "B01"}
            ],
            main: {
                id: '',
                name: '',
                code: '',
            },
            group: {
                id: '',
                name: '',
                code: '',
            },
            sub: {
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
                            "id":   this.main.id ? this.main.id : '',
                            "name": this.main.name,
                            "code": this.main.code
                        }
                        window.console.log('data',data)
                    }, 300);
                })
        },
        editChaild(e){
            e.preventDefault();
            let treeList = this.$refs.dimentsionsTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            window.console.log(dataItem,1)
            if(dataItem.type =="main"){
                this.readonly = true
                this.main = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.dialogM1 = true
            }else if(dataItem.type =="group"){
                this.readonly = true
                this.group = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.main = {
                    id: dataItem.parentId,
                    name: dataItem.parentName,
                    code: dataItem.parentCode,
                }
                this.dialogM2 = true
            }
        },
        addChaild(e){
            window.console.log(3,e)
            e.preventDefault();
            let treeList = this.$refs.dimentsionsTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            if(dataItem.type == "main"){
                this.main = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.group = {
                    id: '',
                    name: '',
                    code: '',
                }
                this.dialogM2 = true
            }else if(dataItem.type =="group"){
                this.group = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    code:   dataItem.code,
                }
                this.sub = {
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
                if(dataItem.get("type") ===`sub`){
                    // row.find("[data-command='customedit']").hide();
                    row.find("[data-command='customadd']").hide();
                    row.css("font-weight", "bold");
                }
            }
        },
    }
}
</script>