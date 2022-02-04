<template>
    <div class="search">
        <Message> </Message>
        <div class="input-area">
            <h4>Search</h4>
            <div class="input-wrap">
                <span>targetPath:</span><input class="bluecolor" type="text" v-model="rules.targetPath ">
            </div>
            <div class="input-wrap">
                <span>excludeDir:</span><input class="bluecolor" type="text" v-model="rules.excludeDir ">
            </div>
            <div class="input-wrap">
                <span> checkReg:</span><input class="redcolor" type="text" v-model="rules.checkReg">
            </div>
            <div class="input-wrap">
                <span>ExcludeReg: </span><input class="orangecolor" type="text" v-model="rules.extandReg">
                <button class="submitBtn" @click="submit">G o</button>
            </div>

        </div>
        <div class="result-area">
            <h4>Result</h4>

            <div class="check-result">
                <h5>Match results</h5>
                <div class="content">

                    <div v-for="(item,i) in checkWordResult.checkResultArr">
                        <p>{{i+1}}.</p>
                        <p>{{item.path}}</p>
                        <p v-for="item in item.str" class="redcolor">{{item}}</p>
                    </div>
                </div>
            </div>

            <div class="other-file">
                <h5>otherFiles</h5>
                <div class="content">
                    <p v-for="(item,index) in checkWordResult.otherFiles">{{index+1}}. {{item}}</p>
                </div>
            </div>
            <div class="err">
                <h5>Err</h5>
                <div class="content">
                    <p v-for="(item,index) in checkWordResult.err">{{index+1}}. {{item}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Message from "@/components/Message.vue";
    export default {
        name: 'XiangshuiSearch',

        components: {

            Message
        },

        data() {
            return {
                rules: {
                    targetPath: "C:\\Users\\Administrator\\Desktop\\test",
                    checkReg: "juzi apple",
                    excludeDir:"TEST_EXAMPLE##node_modules",
                    extandReg: "mp3 et xls xlsx xlsm xlt csv jpeg png jpg ttf woff woff2 doc docx ppt pptx"
                },

                checkWordResult: {
                    otherFiles: [],
                    checkResultArr: [],
                    err: []
                }
            };
        },

        mounted() {

        },

        methods: {
            submit() {


                var obj = JSON.parse(JSON.stringify(this.rules))
                obj.checkReg = "/(" + obj.checkReg.split(" ").filter(a => a != "").join("|") + ")/"
                obj.extandReg = "/^.*\\.(" + obj.extandReg.split(" ").filter(a => a != "").join("|") + ")$/"
                obj.excludeDir=obj.excludeDir.split("##")

                this.$store.commit("addHandlingMessage", "Handling...")
                this.$http.post("/request/checkword", obj).then(res => {
                    this.checkWordResult = res.data
                    this.$store.commit("closeHandlingMessage")
                })
            }
        },

    };
</script>

<style scoped>
    h4 {
        color: #42b983;

    }

    .search {
        padding-top: 35px;

    }

    .input-wrap {
        margin-top: 15px;
    }

    .input-wrap>span {
        width: 105px;
        display: inline-block;
    }

    .input-wrap input {
        border: 1px solid grey;
        padding: 3px;
        width: 500px;
    }

    .input-area {
        padding-left: 10px;
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #42b983;
    }

    .result-area {
        padding-left: 10px;
    }

    .result-area p {
        margin: 8px 0;
    }

    .other-file p {
        color: orange;
    }

    .check-result p {
        color: #00a5dc;
    }

    .orangecolor {
        color: orange;
    }

    .bluecolor {
        color: #00a5dc;
    }

    .redcolor {
        color: red;
    }

    .check-result .redcolor {
        color: red;
    }

    h5 {
        font-weight: normal;
        margin-top: 10px;
        font-size: 15px;
    }

    .submitBtn {
        margin-left: 15px;
        padding: 5px 20px;
        border-radius: 5px;
        vertical-align: middle;
        cursor: pointer;
        background: rgb(228, 228, 228);
    }

    .submitBtn:hover {
        background: orange;
        color: #fff;

    }

    .content {
        background: #eee;
        padding: 5px;
        padding-left: 25px;
    }

    .err p {
        color: rgb(141, 0, 0);
    }
</style>