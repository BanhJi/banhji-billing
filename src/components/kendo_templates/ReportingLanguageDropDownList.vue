<template>
    <v-select
        :loading="languages.length <= 0"
        class="mt-1"
        placeholder="Select"
        v-model="language"
        :items="languages"
        item-text="text"
        item-value="value"
        @change="emitLanguage();onChanged();"
        outlined/>
</template>

<script>
    export default {
        name: 'ReportingLanguageDropDownList',
        props: ["initLanguage"],
        data () {
            return {
                language    : 'english',
                languages   : [
                    { text: 'English', value: 'english' },
                    { text: 'ខ្មែរ', value: 'local' },
                ],
            }
        },
        methods: {
            emitLanguage () {
                this.$emit('emitLanguage', this.language);
            },
            onChanged() {
                this.$emit('onChanged');
            },
        },
        watch: {
            initLanguage () {
                this.language = this.initLanguage;
            }
        },
        mounted () {
            /* Initial Obj */
            this.language = this.initLanguage;
        }
    }
</script>