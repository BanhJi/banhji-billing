<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-card
                        outlined
                        dense
                        class="pa-4 no_border rounded-sm"
                        color="white">
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-card outlined dense class="no_border">
                                <h2 class="mb-0">{{$t('Batch_invoice')}}</h2>
                                <v-icon
                                    @click="close()"
									style="cursor: pointer; color: #333; font-size: 40px;"
									class="float-right"
                                >close
                                </v-icon>
                            </v-card>
                            <v-row>
                                <v-col sm="12" cols="12">
                                    <div class="function_content">
                                        <v-form ref="form" v-model="valid" lazy-validation>
                                            <v-row>
                                                <v-col sm="2" class="align-center justify-center d-flex ">
                                                    <div>
                                                        <v-card @click="ClickSteps(1)" width="44" height="44" outlined dense :color="activeColor1" class="pointer no_border align-center justify-center d-flex rounded-circle ">
                                                            <h3 class="mt-2 white--text" style="font-size: 24px">1</h3>
                                                        </v-card>
                                                        <p class="text-uppercase mt-2">{{$t('input')}}</p>
                                                    </div>
                                                </v-col>
                                                 <v-col sm="2" class="align-center justify-center d-flex ">
                                                    <div>
                                                        <v-card @click="ClickSteps(2)" width="44" height="44" outlined dense :color="activeColor2" class="pointer ml-8 no_border align-center justify-center d-flex rounded-circle ">
                                                            <h3 class="mt-2 white--text" style="font-size: 24px">2</h3>
                                                        </v-card>
                                                        <p class="text-uppercase text-center mt-2">{{$t('review')}}</p>
                                                    </div>
                                                </v-col>
                                            </v-row> 
                                            <v-divider/>
                                            <!-- Body function to input -->
                                            <div v-show="steps==1">
                                                 <Input ref="modal" @returnData="refresh"/>
                                            </div>
                                            <!-- Steps 2 Adjustemnt -->
                                            <div v-show="steps==2">
                                                <Review :loadData="loadData"/>
                                            </div>
                                        </v-form>
                                    </div>
                                </v-col>
                            </v-row>
                            <div class="function_footer">
								<!-- Warning Message -->
                                <v-btn @click="close" class="float-left  btn_cancel">{{$t('cancel')}}</v-btn>
                                <v-btn class="float-right btn_save_close" @click="saveSpets()" >{{$t(save_next)}}</v-btn>
                                <!-- <v-btn class="float-right mx-3 white--text" color="primary">{{$t('save_draft')}}</v-btn> -->
                            </div>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
            <LoadingMe
                    :isLoading="showLoading"
                    :fullPage="true"
                    :myLoading="true"
                />
        </v-container>
    </v-app>
</template>

<script>
    import {i18n} from '@/i18n';
    import LoadingMe from '@/components/Loading'
    import Input from '@/views/bills/run_batch/Input'
    import Review from '@/views/bills/run_batch/Review'
    export default {
        name: "AddProduct",
        components:{
            'LoadingMe': LoadingMe,
            Input,
            Review,
		},
        data: () => ({
            templates:[],
            showLoading:false,
            valid: '',
            bill_date: "",
            journal_date: '',
            steps: 1,
            reachTopStep: 0,
            check: false,
            save_next: 'save_next',
            activeColor1: "primary",
            activeColor2: "third",
            isFinal : false,
            // greyText
            check1: false,
            check2: false,
            payroll_id: '',
            payrollList: {},
            loadPayrolls: [],
            loadData: {}
        }),
        methods:{
            refresh(data){
                if(data){
                    this.loadData = data
                }
            },
            saveSpets(){
                if(this.steps === 1){
                    this.$refs.modal.onSaveStap()
                }else if(this.steps === 2){
                    this.$refs.adjust.saveAdjust()
                }
                this.nextStpes()
            },
            nextStpes(){
                this.steps = this.steps + 1
                this.reachTopStep = this.steps
                this.stepsCondition(this.steps)
            },
            ClickSteps(step){
                if(this.steps == step){
                    return
                }
                if(step > this.reachTopStep){
                    return
                }
                if(step != 2){
                    this.save_next =  "confirm_next"
                }else{
                    this.save_next = "confirm_close"
                }
                this.steps = step
                this.stepsCondition(this.steps)
            },
            stepsCondition(val){
                switch(val){
                    case 1: 
                        this.activeColor1= "primary"
                        this.activeColor2= "third"
                        break
                    default: 
                        this.activeColor1= "third"
                        this.activeColor2= "primary"
                        this.isFinal = true
                        this.save_next = "confirm_close"
                  }
            },
            close(){
                this.$swal({
                    title: i18n.t('msg_title_warning'),
                    text: i18n.t('msg_discard'),
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonText: i18n.t('cancel'),
                    confirmButtonColor: "#4d4848",
                    cancelButtonColor: "#ED1A3A",
                    confirmButtonText: i18n.t('discard'),
                }).then((result) => {
                    if (result.value) {
                        if(this.steps === 1){
                            this.$refs.modal.goBack()
                        }else if(this.steps === 2){
                            this.$refs.adjust.goBack()
                        }
                    }
                });
            }
        },
        mounted(){
        },
        watch: {
        }
    }

</script>

<style scoped>
    .function_content {
        padding: 0 25px 25px;
        border-bottom: 0;
        background-color: #fff !important;
    }

    @media (min-width: 1264px) {
        .container {
            /* max-width: 1185px; */
            max-width: 1080px !important;
        }
    }
    .grayBg{
        background-color: #f3f8ff;
    }
    @media (max-width: 576px) {
        ..mb-6 {
            margin-bottom: 0 !important;
        }
    }
 
    .border_grey{
         border: 1px solid #d6d7d8;
    }
    .attachment_table{
        width:100%;
    }
    
    .my_checkbox input[type=checkbox] + label {
        display: grid;
        grid-template-columns: 20% 80%;
        margin: 0.2em 0px;
        cursor: pointer;
        line-height: 16px;
        padding: 0.2em;
    }
</style>