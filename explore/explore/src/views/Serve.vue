<template>
    <div class="search">

        <Message> </Message>
        <div class="input-area">
            <h4>Serve</h4>
            <div class="input-wrap">
                <span>Url:</span><input class="bluecolor" type="text" v-model="rules.serverUrl ">
            </div>
            <div class="input-wrap">
                <span> Path:</span><input class="redcolor" type="text" v-model="rules.serverPath">
            </div>
            <div class="input-wrap">
                <span>Method: </span><input class="orangecolor" type="text" v-model="rules.method">
                <button class="submitBtn" @click="submit">G o</button>
                <button class="submitBtn" @click="openHistory">history</button>
                <button class="submitBtn" @click="clearResult">clear</button>
            </div>

        </div>

        <div class="history" v-show="isShowHistory">
            <h4>History</h4>

            <Table v-bind:objKeys="paKeys" @table-click="copyServe">
            </Table>
        </div>
        <div class="result-area">
            <h4>Result</h4>

            <div class="check-result">
                <h5>Match results</h5>
                <div class="content">

                    <div v-for="(item,i) in answer.arr">
                        <p class="orangecolor">{{i+1}}.</p>
                        <p>{{item}}</p>

                    </div>
                </div>
            </div>


            <div class="err">
                <h5>Err</h5>
                <div class="content">
                    <p v-for="item in answer.err">{{item}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Table from "@/components/crud/Table.vue";
    import Message from "@/components/Message.vue";

    export default {
        name: 'XiangshuiSearch',
        components: {
            Table,
            Message
        },

        data() {
            return {
                isShowHistory: false,
                rules: {
                    serverUrl: "",
                    serverPath: "",
                    method: "text"
                },

                answer: {
                    arr: [],
                    err: []
                },
                paKeys: {
                    name: "Pa",
                    src: ["lifeData", "serve"],
                    key: [
                        {
                            name: "name",
                            attribute: "button",
                            width: "130px",
                        },
                        {
                            name: "url",
                            attribute: "textarea",
                            width: "230px",
                        },
                        {
                            name: "content",
                            attribute: "textarea",
                            width: "230px",
                        },


                    ],
                },
            };
        },



        mounted() {

        },

        methods: {
            submit() {
                this.$store.commit("addHandlingMessage", "Handling...")
                this.$http.post("/request/serve", this.rules).then(res => {
                    this.$store.commit("closeHandlingMessage")

                    this.answer = res.data
                })
            },
            copyServe(obj) {

                this.rules.serverUrl = obj.url
                this.rules.serverPath = obj.content
                this.isShowHistory = false
            },
            openHistory() {
                this.isShowHistory = !this.isShowHistory
            }, clearResult() {
                this.answer = {
                    arr: [],
                    err: []
                }
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

    .check-result .orangecolor {
        color: orange;
    }
</style>