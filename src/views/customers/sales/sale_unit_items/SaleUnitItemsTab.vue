<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <v-tabs>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('sale_unit_item') }}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('categories') }}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-uppercase">
                        {{ $t('reports') }}
                    </span>
                </v-tab>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text class="">
                            <SaleUnitItems/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text class="">
                            <Categories/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text class="">
                            <Reports/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "SaleUnitItemTab",
    components: {
        SaleUnitItems: () => import('./SaleUnitItems'),
        Categories: () => import('./Categories'),
        Reports: () => import('./Reports')
    },
    data: () => ({}),
    watch: {},
    methods: {
        clickMe(data) {
            this.$route.push(data.link);
        }
    }
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
.menuable__content__active{
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
	