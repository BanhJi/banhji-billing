<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <v-row>
        <v-col sm="12" cols="12" class="pt-0 px-10">
          <div class="a4">
         <div style="height: 42px;" class="mb-2">
              <v-btn
                color="third"
                class="white--text text-capitalize float-right"
                @click="EdtiForm(1)"
              >
                {{ $t("edit") }}
              </v-btn>
              <v-btn
                color="third"
                class=" float-right text-capitalize  white--text mx-3"
                @click="_print(3)"
                >{{ $t("preview") }}</v-btn
              >
              <v-btn
                class="text-capitalize white--text  float-right mx-0"
                color="primary"
                @click="ResetForm"
                >{{ $t("reset") }}</v-btn
              >
            </div>
            <div
              :style="{
                'padding-left': invoice_setting.margin / 100 + 'in !important',
                'padding-right': invoice_setting.margin / 100 + 'in !important',
              }"
              style="box-shadow: rgb(0 0 0 / 20%) 0px 6px 12px 0px;;padding: 72px;  min-height: 297mm;"
            >
              <div v-html="form_invoice"></div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" scrollable max-width="1124px">
        <v-card>
          <div class="modal_header">
            <v-card-title>{{ $t("account_form") }}</v-card-title>
            <v-icon class="btn_close" @click="dialog = false">close</v-icon>
          </div>
          <v-card-text class="modal_text_content">
            <v-row>
              <v-col sm="3" cols="12" class="">
                <label class="label">{{ $t("form_title") }}</label>
                <p class="text_tip">Input title form</p>
                <v-text-field
                  outlined
                  tage="Form Title"
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.title"
                />
                <!-- <label>{{ $t("address") }}</label>
                <v-text-field
                  class=" mb-3"
                  outlined
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.address.title"
                /> -->
                <label class="label">{{ $t("table_header") }}</label>
                <v-radio-group
                  class="mt-0 mb-0 custom-radio"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.table_header"
                  row
                >
                  <v-radio :label="$t('uppercase')" :value="1" />
                  <v-radio :label="$t('capitalize')" :value="2" />
                </v-radio-group>
                <label class="label">{{ $t("margin_left_right") }}</label>
                <v-slider
                  @change="UpdateFormChange"
                  v-model="invoice_setting.margin"
                  max="100"
                  min="0"
                  thumb-label
                ></v-slider>
                <label>{{ $t("address_location") }}</label>
                <v-select
                  outlined
                  @change="UpdateFormChange"
                  placeholder=""
                  :items="address_location"
                  v-model="invoice_setting.address.align"
                />

                <label class="label">Position Logo,Size,and Size </label>
                <v-slider
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.width"
                  max="400"
                  min="20"
                  thumb-label
                ></v-slider>
                <v-slider
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.height"
                  max="400"
                  min="20"
                  thumb-label
                ></v-slider>
                <label>{{ $t("hide_logo") }}</label>
                <v-checkbox
                  class="mt-0"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.hide"
                />
                <label>{{ $t("primary_logo") }}</label>
                <v-checkbox
                  class="mt-0"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.isPrimary"
                />
                <label>{{ $t("hide_address_section") }}</label>
                <v-checkbox
                  class="mt-0"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.header"
                />
                <label>{{ $t("font_size") }}</label>
                <v-text-field
                  class=""
                  @change="UpdateFormChange"
                  outlined
                  v-model="invoice_setting.fontSize"
                />
                <label>{{ $t("title_font_size") }}</label>
                <v-text-field
                  class=""
                  @change="UpdateFormChange"
                  outlined
                  v-model="invoice_setting.headerFontSize"
                />

                <v-select
                  @change="UpdateFormChange"
                  outlined
                  :items="language"
                  v-model="invoice_setting.language"
                ></v-select>

                <v-select
                  @change="UpdateFormChange"
                  outlined
                  :items="language"
                  v-model="invoice_setting.language"
                ></v-select>
                <v-row class="mt-0 mb-4">
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('center')" class="logo_pos">
                      Center
                    </button>
                  </v-col>
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('left')" class="logo_pos">
                      Left
                    </button>
                  </v-col>
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('right')" class="logo_pos">
                      Right
                    </button>
                  </v-col>
                </v-row>

                <label class="label">{{ $t("signature") }}</label>
                <v-row>
                  <v-col sm="2" cols="2" class="text-center py-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      v-model="invoice_setting.signature.prepared_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center">
                    <v-text-field
                      class=""
                      @change="UpdateFormChange"
                      outlined
                      placeholder="Prepared by"
                      v-model="invoice_setting.signature.prepared_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.reviewed_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Reviewed by"
                      v-model="invoice_setting.signature.reviewed_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.verified_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Verified by"
                      v-model="invoice_setting.signature.verified_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.approved_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Approved by"
                      v-model="invoice_setting.signature.approved_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.recorded_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Recorded by"
                      v-model="invoice_setting.signature.recorded_by.text"
                    />
                  </v-col>
                  <!-- color -->
                  <v-divider />
                  <label>{{ $t("color_background") }}</label>
                  <v-col sm="12" cols="4" class="text-center d-flex pt-2">
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.color"
                    />
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.background"
                    />
                  </v-col>
                  <label>{{ $t("page_size") }}</label>
                  <v-col sm="12" cols="4" class="">
                    <div>
                      <v-btn
                        :class="{
                          'primary--text': invoice_setting.page == 'A4',
                        }"
                        @click="invoice_setting.page = 'A4'"
                        >A4</v-btn
                      >
                      <v-btn
                        :class="{
                          'primary--text': invoice_setting.page == 'A5',
                        }"
                        @click="invoice_setting.page = 'A5'"
                        class="mx-2"
                        >A5</v-btn
                      >
                    </div>
                  </v-col>
                  <v-col sm="12" cols="4" class="pl-0">
                    <p>{{ $t("show_table_column") }}</p>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.one"
                      />
                      <label>{{ $t("no.") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.two"
                      />
                      <label>{{ $t("date_from") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.three"
                      />
                      <label>{{ $t("date_to") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.four"
                      />
                      <label>{{ $t("item") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0"
                        v-model="invoice_setting.column.five"
                      />
                      <label>{{ $t("description") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.six"
                      />
                      <label>{{ $t("on_hand") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        disabled
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.seven"
                      />
                      <label>{{ $t("qty") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.eight"
                      />
                      <label>{{ $t("uom") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.nine"
                      />
                      <label>{{ $t("price") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.ten"
                      />
                      <label>{{ $t("amount") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten1"
                      />
                      <label>{{ $t("modifier") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten2"
                      />
                      <label>{{ $t("discount") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten3"
                      />
                      <label>{{ $t("vat") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten4"
                      />
                      <label>{{ $t("specific_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten5"
                      />
                      <label>{{ $t("other_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten6"
                      />
                      <label>{{ $t("pl_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten7"
                      />
                      <label>{{ $t("sale_unit") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten8"
                      />
                      <label>{{ $t("employee") }}</label>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="9" cols="11" class="bg_white">
                <div class="ma-3 mt-6">
                  <div
                    :style="{
                      'padding-left': invoice_setting.margin / 100 + 'in !important',
                      'padding-right': invoice_setting.margin / 100 + 'in !important',
                    }"
                    style="box-shadow: rgb(0 0 0 / 20%) 0px 6px 12px 0px;;padding: 72px;  min-height: 297mm;"
                  >
                    <div v-html="form_invoice"></div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="modal_footer">
            <v-btn @click="saveForm" class="btn_save_close float-right">{{
              $t("save_close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
// const axios = require("axios");
import { taxInvoice, print } from "@/form/invoices.js";
import { i18n } from "@/i18n";
const {
  getFormSetting,
  formSettingCreate,
  deleteFormSetting,
} = require("@/scripts/settingsHandler.js");

let def = {
  title: "Invoice Tax Default ",
  logo: { width: 200, height: 200, position: "center", hide: true, isPrimary: false },
  color: { background: "#3B393E", color: "#ffffff" },
  page: "A4",
  form_number: 1,
  table_header: 1,
  margin: 75,
  fontSize: 12,
  headerFontSize: 18,
  header: false,
  column: {
    one: true,
    two: false,
    three: false,
    four: false,
    five: true,
    six: false,
    seven: true,
    eight: true,
    nine: true,
    ten: true,
    ten1: false,
    ten2: false,
    ten3: false,
    ten4: false,
    ten5: false,
    ten6: false,
    ten7: false,
    ten8: false,
  },
  signature: {
    prepared_by: { status: false, text: "Prepare By" },
    reviewed_by: { status: false, text: "Prepare By" },
    verified_by: { status: false, text: "Prepare By" },
    approved_by: { status: false, text: "Approved By" },
    recorded_by: { status: false, text: "Recorded By" },
  },
  language: "English",
  address: { title: "St, 120 Phnom Penh", align: "center" },
};
export default {
  components: {
    // LoadingMe
  },
  data() {
    return {
      pk: "",
      sk: "",
      invoice_setting: {
        title: "Invoice Tax Default ",
        logo: { width: 200, height: 200, position: "center", hide: true },
        color: { background: "#3B393E", color: "#ffffff" },
        header: false,
        page: "A4",
        column: {
          one: true,
          two: false,
          three: false,
          four: false,
          five: true,
          six: false,
          seven: true,
          eight: true,
          nine: true,
          ten: true,
          ten1: false,
          ten2: false,
          ten3: false,
          ten4: false,
          ten5: false,
          ten6: false,
          ten7: false,
          ten8: false,
        },
        signature: {
          prepared_by: { status: false, text: "Prepare By" },
          reviewed_by: { status: false, text: "Prepare By" },
          verified_by: { status: false, text: "Prepare By" },
          approved_by: { status: false, text: "Approved By" },
          recorded_by: { status: false, text: "Recorded By" },
        },
        language: "English",
        address: { title: "St, 120 Phnom Penh", align: "center" },
      },
      address_location: ["center", "left", "right"],
      form_invoice: taxInvoice(this.items, "2", def),
      slider_widht: 5,
      slider_height: 5,
      image_size: {
        width: "100px",
        height: "100px",
      },
      language: ["English", "Khmer", "Both"],
      dialogm1: "",
      dialog: false,
    };
  },

  methods: {
    ResetForm() {
      let params = "?id=" + this.pk;
      if (this.pk != "") {
        deleteFormSetting(params).then(async (res) => {
          if (res.data.statusCode === 200) {
            this.invoice_setting = def;
            this.$snotify.success(i18n.t("success"));
            this.form_invoice = await taxInvoice(
              this.items,
              this.invoice_setting
            );
          } else {
            this.$snotify.error(i18n.t("failed"));
          }
        });
      }
    },
    saveForm() {
      let data = {
        type: "form",
        formType: "Tax Invoice",
        settings: this.invoice_setting,
        sk: this.sk,
        pk: this.pk,
      };
      formSettingCreate(data).then((res) => {
        window.console.log(res);
        if (res.data.statusCode == 201) {
          this.dialog = false;
          this.$snotify.success(i18n.t("success"));
          this.sk = res.data.data.sk;
          this.pk = res.data.data.pk;
        } else {
          this.$snotify.error(i18n.t("failed"));
        }
      });
    },
    getFormSettingS() {
      let params = "?formType=Tax Invoice";
      getFormSetting(params).then((res) => {
        if (res.data.statusCode === 200) {
          if (res.data.data.length > 0) {
            this.sk = res.data.data["0"].sk;
            this.pk = res.data.data["0"].pk;
            this.invoice_setting = res.data.data["0"].settings;
            this.form_invoice = taxInvoice(
              this.items,
              this.invoice_default,
              this.invoice_setting
            );
          }
        }
      });
    },

    UpdateFormChange() {
      this.form_invoice = taxInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
    },
    logoPosition(pos) {
      this.invoice_setting.logo.position = pos;
      this.form_invoice = taxInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
    },
    selectedForm(val) {
      this.selected_form = val;
    },
    _print(id) {
      print(this.items, id, this.invoice_setting);
    },
    EdtiForm() {
      this.form_invoice = taxInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
      this.dialog = true;
    },
  },
  computed: {},
  mounted: async function() {
    this.getFormSettingS();
  },
};
</script>
<style scoped>
.a4 {
  width: 205mm;
  /* to centre page on screen*/
  margin-left: auto;
  margin-right: auto;
}
.btn_edit {
  background-color: #4e6470 !important;
  color: #fff !important;
  height: 35px;
}
.v-card__actions .v-btn.v-btn {
  padding: 0 16px;
}
.function_footer {
  padding: 15px;
  display: inline-block;
}
.bg_white {
  background-color: #fff;
  padding-left: 0;
  padding-top: 0;
}
.wrapper_form {
  width: 99%;
  margin: 0 auto;
}
.wrapper_form .header .logo_company {
  text-align: center;
  padding-top: 0;
}
.wrapper_form .header .logo_company img {
  width: 100px;
  height: auto;
}
.wrapper_form .header h2 {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-size: 25px;
}
.wrapper_form .header p {
  text-align: center;
  margin-bottom: 8px;
  width: 93%;
  margin: 0 auto;
}
.wrapper_form .header p.phone_email {
  text-align: center;
}
.wrapper_form .content h3.title {
  text-transform: uppercase;
  text-align: center;
  font-size: 25px !important;
  font-weight: 700 !important;
}
.new_line {
  clear: both;
}

.logo_pos {
  padding: 5px 5px;
  background: #fff;
  width: 60px;
  font-size: 12px;
  border-radius: 6px;
}
.color_option {
  width: 62px;
  border: 1px solid #808080;
  margin-right: 4px;
  height: 37px;
  border-radius: 6px;
}

@media (max-width: 576px) {
}
</style>
