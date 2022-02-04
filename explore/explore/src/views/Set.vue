<template>
  <div class="set">
    <Message> </Message>
    <h2>
      Settings
    </h2>
    <div class="main">
      <div class="left">
        <ul>
          <li v-for="item in nameArr" :class="{ active: activeName == item }" @click="setActive(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="right">
        <Table @table-click="fileOpen" v-show="activeName == 'File'" v-bind:objKeys="fileKeys">
        </Table>

        <Table @table-click="fileOpen" v-show="activeName == 'Url'" v-bind:objKeys="urlKeys">
        </Table>

        <Table v-show="activeName == 'Link'" v-bind:objKeys="linkKeys">
        </Table>

        <Table @table-click="cmdExcute" v-show="activeName == 'Cmd'" v-bind:objKeys="cmdKeys">
        </Table>

        <Table @table-click="paOpen" v-show="activeName == 'Pa'" v-bind:objKeys="paKeys">
        </Table>

        <Table v-show="activeName == 'Default Shotcut'" v-bind:objKeys="quickDefaultKeys">
        </Table>
        <Table @table-click="excuteCopy" v-show="activeName == 'Quick copy'" v-bind:objKeys="copyKeys">
        </Table>

        <Table v-show="activeName == 'Favorite Picture'" v-bind:objKeys="likeKeys">
        </Table>
        
        <Table v-show="activeName == 'likeSongs'" v-bind:objKeys="likeSongsKeys">
        </Table>

        <Table v-show="activeName == 'Word'" v-bind:objKeys="wordKeys">
        </Table>

        <Table v-show="activeName == 'oneWord'" v-bind:objKeys="oneWordKeys">
        </Table>

        <Table v-show="activeName == 'AutoClose'" v-bind:objKeys="AutoCloseKeys">
        </Table>

        <Table v-show="activeName == 'maininterface'" v-bind:objKeys="maininterfaceKeys">
        </Table>

        <Table v-show="activeName == 'subinterface'" v-bind:objKeys="subinterfaceKeys">
        </Table>

        <Table v-show="activeName == 'httpPort'" v-bind:objKeys="httpPortKeys">
        </Table>

        <Table v-show="activeName == 'escToDisBtn'" v-bind:objKeys="escToDisBtnKeys">
        </Table>

        <Table v-show="activeName == 'behavior'" v-bind:objKeys="behaviorKeys">
        </Table>

        <Table v-show="activeName == 'bill'" v-bind:objKeys="billKeys">
        </Table>

        <Table v-show="activeName == 'record'" v-bind:objKeys="recordKeys">
        </Table>

        
      </div>
    </div>
  </div>
</template>

<script>
  import Table from "../components/crud/Table.vue";
  import Message from "../components/Message.vue";
  export default {
    name: "Set",
    data() {
      return {

        activeName: "File",
        nameArr: [
          "File",
          "Url",
          "Link",
          "Cmd",
          "Pa",
          "Quick copy",
          "Default Shotcut",
          "Favorite Picture",
          "likeSongs",
          "Word",
          "oneWord",
          "AutoClose",
          "maininterface",
          "subinterface",
          "httpPort",
          "escToDisBtn",
          "behavior",
          "bill",
          "record",
        ],
        fileKeys: {
          name: "File",
          src: ["lifeData", "file"],
          key: [
            {
              name: "name",
              attribute: "button",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },
            {
              name: "shortcut",
              attribute: "text",
              width: "130px",
            },
            {
              name: "jsStr",
              attribute: "textarea",
              width: "230px",
            },
          ],
        },
        urlKeys: {
          name: "Url",
          src: ["lifeData", "url"],
          key: [
            {
              name: "name",
              attribute: "button",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },
            {
              name: "shortcut",
              attribute: "text",
              width: "130px",
            },
            {
              name: "jsStr",
              attribute: "textarea",
              width: "230px",
            },
          ],
        },
        linkKeys: {
          name: "Link",
          src: ["lifeData", "link"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },

          ],
        },
        cmdKeys: {
          name: "Cmd",
          src: ["lifeData", "cmd"],
          key: [
            {
              name: "name",
              attribute: "button",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },
            {
              name: "shortcut",
              attribute: "text",
              width: "130px",
            },
          ],
        },

        paKeys: {
          name: "Pa",
          src: ["lifeData", "pa"],
          key: [
            {
              name: "name",
              attribute: "button",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },

            {
              name: "shortcut",
              attribute: "text",
              width: "90px"
            },
            {
              name: "result",
              attribute: "text",
              width: "90px"
            },
          ],
        },
        copyKeys: {
          name: "Quick copy",
          src: ["lifeData", "quickCopy"],
          key: [
            {
              name: "name",
              attribute: "button",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "230px",
            },
            {
              name: "shortcut",
              attribute: "text",
              width: "130px",
            },
          ],
        },
        quickDefaultKeys: {
          name: "Default Shotcut",
          systemSetting:true,
          src: ["lifeData", "quickDefault"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
       
            {
              name: "shortcut",
              attribute: "text",
              width: "130px",
            },
          ],
        },
        likeKeys: {
          name: "Favorite Picture",
          src: ["lifeData", "like"],
          key: [
            {
              name: "url",
              attribute: "textarea",
              width: "130px",
            },
            {
              name: "copyright",
              attribute: "textarea",
              width: "230px",
            },
          ],
        },
        likeSongsKeys: {
          name: "likeSongs",
          src: ["lifeData", "likeSongs"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
         
          ],
        },
     
        wordKeys: {
          name: "Word",
          isobj: true,
          src: ["lifeData", "myWords"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",
            },
            {
              name: "content",
              attribute: "textarea",
              width: "360px",
            },

          ],
        },
        oneWordKeys: {
          name: "oneWord",
          src: ["lifeData", "oneWord"],
          key: [
            {
              name: "content",
              attribute: "textarea",
              width: "360px",
            },
          
          ],
        },
        AutoCloseKeys: {
          name: "AutoClose",
          isobj: true,
          systemSetting:true,
          src: ["lifeData", "settings", "AutoClose"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",
            },
            {
              name: "content",
              attribute: "text",
              width: "130px",
            },

          ],
        },
        maininterfaceKeys: {
          name: "maininterface",
          isobj: true,
          systemSetting:true,
          src: ["lifeData", "settings", "maininterface"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",

            },
            {
              name: "content",
              attribute: "text",
              width: "130px",
            },

          ],
        },
        subinterfaceKeys: {
          name: "subinterface",
          isobj: true,
          systemSetting:true,
          src: ["lifeData", "settings", "subinterface"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",
           
            },
            {
              name: "content",
              attribute: "text",
              width: "130px",
            },

          ],
        },
        httpPortKeys: {
          name: "httpPort",
          isobj: true,
          systemSetting:true,
          src: ["lifeData", "settings", "httpPort"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",
            },
            {
              name: "content",
              attribute: "text",
              width: "130px",
            },

          ],
        },

        

        escToDisBtnKeys: {
          name: "escToDisBtn",
          isobj: true,
          systemSetting:true,
          src: ["lifeData", "settings", "escToDisBtn"],
          key: [
            {
              name: "attr",
              attribute: "text",
              width: "130px",
            },
            {
              name: "content",
              attribute: "text",
              width: "130px",
            },

          ],
        },
     
        
        behaviorKeys: {
          name: "behavior",
          isNotObj:true,
          src: ["recordData", "behavior","subjects"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
          ],
        },

        billKeys: {
          name: "bill",
          isNotObj:true,
          src: ["recordData", "bill","subjects"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
          ],
        },


        recordKeys: {
          name: "record",
          isNotObj:true,
          src: ["recordData", "record","subjects"],
          key: [
            {
              name: "name",
              attribute: "text",
              width: "130px",
            },
          ],
        },
      };
    },
    computed: {},
    methods: {

      setActive(item) {
        this.activeName = item;
      },
      fileOpen(obj) {
        this.$http.post("/request/excuteNewWidow", { url: obj.content });
      },
      paOpen(obj) {
        this.$http.post("/request/excuteNewWidow", { url: obj.name });
      },
      cmdExcute(obj) {
        this.$http.post("/request/excutecmd", { content: obj.content });
      },
      excuteCopy(obj) {

        this.$http.post("/request/changestr", {
          name: this.$store.state.TheVersion,
          value: this.$store.state.user.time,
          str: obj.content,
          method: "get"
        }).then(res => {

          this.$http.post("/request/excuteCopy", { content: res.data });
        })


      }
    },
    components: {
      Table,
      Message,
    },
  };
</script>

<style scoped>
  .set {
    padding-top: 40px;
    height: 100%;
  }

  h2 {
    padding-left: 15px;
    height: 35px;
    border-bottom: 1px solid #dedede;
  }

  .main {
    height: calc(100% - 35px);
  }

  .main .left {
    width: 120px;
    float: left;
    background: rgb(255, 244, 183);
    height: 100%;

    overflow: auto;
  }

  .main .left li {
    height: 35px;
    line-height: 35px;
    padding-left: 5px;
    cursor: pointer;
  }

  .main .left li:hover {
    background: rgb(235, 218, 120);
  }

  .main .right {
    width: calc(100% - 120px);
    float: right;
    height: 100%;
    overflow: auto;
  }

  .active {
    background: rgb(235, 218, 120);
  }
</style>