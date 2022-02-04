<template>
  <div class="table-div">
    <div class="table-header clearFix">
      <h5>{{ objKeys.name }}:</h5>
      <input type="hidden" v-bind:value="forChangereresponse.name" />
      <button class="add" @click="addFn">+</button>
    </div>
    <table border="1px" cellspacing="0" style="word-wrap: break-word; word-break: break-all;">
      <div>
        <thead>
          <tr>
            <td><div class="tableNo">No.</div></td>
            <td v-for="item in objKeys.key">
              <div v-bind:style="{ width: item.width }">{{ item.name }}</div>
            </td>
            <td>
              <div style="width:125px">operate</div>
            </td>
          </tr>
        </thead>
      </div>
      <div class="table-tbody">
        <tbody>
          <tr v-for="(item, index) in myobj">
            <td><div class="tableNo">{{index+1}}</div></td>
            <td v-for="i in objKeys.key">
              <div v-bind:style="{ width: i.width, 'text-align': i.textAlign }">
                <span v-if="i.attribute == 'button'" class="button-td">
                  <button v-if="editIndex != index" @click="emmitFn(item)">
                    {{ item[i.name] }}
                  </button>
                  <textarea v-if="editIndex == index" name="" id="" cols="30" rows="10"
                    v-model="temObj[i['name']]"></textarea>
                </span>
                <span v-if="i.attribute == 'textarea'" class="textarea-td">
                  <textarea v-if="editIndex != index" name="" id="" cols="30" rows="10"
                    :value="item[i['name']]"></textarea>
                  <textarea v-if="editIndex == index" name="" id="" cols="30" rows="10"
                    v-model="temObj[i['name']]"></textarea>
                </span>
                <span v-if="i.attribute == 'text'" class="text-td">
                  <span v-if="editIndex != index"> {{ item[i.name] }}</span>
                  <textarea v-if="editIndex == index" name="" id="" cols="30" rows="10"
                    v-model="temObj[i['name']]"></textarea>
                </span>
                <span v-if="i.attribute == 'bloon'" class="text-td">
                  <slot v-if="editIndex != index" :name="i['name']" v-bind:user="{ status: item[i['name']] }">{{
                    temObj[i["name"]] }}</slot>
                  <button v-if="editIndex == index" @click="changebloon(i['name'])">
                    <slot :name="i['name']" v-bind:user="{ status: temObj[i['name']] }">{{ temObj[i["name"]] }}</slot>
                  </button>
                </span>

                <span v-if="i.attribute == 'control-date'" class="text-td">
                  <span v-if="editIndex != index">{{ item[i["name"]] }}</span>
                  <input type="date" v-if="editIndex == index" v-model="temObj[i['name']]" />
                </span>

                <span v-if="i.attribute == 'control-time'" class="text-td">
                  <span v-if="editIndex != index">{{ item[i["name"]] }}</span>
                  <input type="time" v-if="editIndex == index" v-model="temObj[i['name']]" />
                </span>

                <span v-if="i.attribute == 'new-slot'" class="text-td">
                  <slot v-if="editIndex != index" :name="i['name']" v-bind:user="{ item: item }"></slot>
                </span>
              </div>
            </td>
            <td>
              <div style="width:125px">
                <span class="operate-td">
                  <span v-if="editIndex != index">
                    <button class="btn-edit" @click="editFn(index, item)">
                      Edit
                    </button>
                    <button class="btn-delete" @dblclick="deleteFn(index, item)">
                      Delete
                    </button>
                  </span>
                  <span v-if="editIndex == index">
                    <button class="btn-cancel" @click="cancelFn(index, item)">
                      Cancel
                    </button>
                    <button class="btn-save" @click="saveFn(index, item)">
                      Save
                    </button>
                  </span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </div>
    </table>
  </div>
</template>

<script>


  export default {
    name: "Table",
    data() {
      return {
        forChangereresponse: { name: 12 },
        editIndex: -1,
        saveOrder: -1,
        temObj: {},
      };
    },
    props: ["objKeys"],
    mounted() {
    
    },
    created() {
    
    },
    destroyed() {
    
    },

    computed: {
      myobj() {
        var tem = this.$store.state;
        if (this.objKeys.isNotObj ) {
          if(!this.$store.state.recordData.behavior){
            return []
          }
          this.objKeys.src.forEach((item) => {
            tem = tem[item];
          });
          var newArr=[]
          tem.map((item)=>{
           let obj={
             name:item
           }
           newArr.push(obj)
          })
          return newArr;
        }

        if (!this.objKeys.isobj) {
          this.objKeys.src.forEach((item) => {
            tem = tem[item];
          });
          return tem;
        } else {
          this.objKeys.src.forEach((item) => {
            tem = tem[item];
          });
          let arr = [];
          for (var i in tem) {
            let obj = {
              attr: i,
              content: tem[i],
            };
            arr.push(obj);
          }
          return arr;
        }
      },
    },
    methods: {
      cancelFn(index, item) {
        this.editIndex = -1;
        this.temObj = {};
        if (this.saveOrder == 0) {
          this.saveOrder = -1;
          if (!this.objKeys.isobj) {
          
            this.$store.dispatch("deleteDataAction", {
              index,
              arr: this.objKeys.src,
            });
          } else {
            this.$store.dispatch("deleteObjAttr", {
              arr: this.objKeys.src,
              attr: item.attr,
            });
          }
        }
      },
      editFn(i) {
        this.editIndex = i;
        this.temObj = {};
        for (var key in this.myobj[i]) {
          this.temObj[key] = this.myobj[i][key];
        }
      },
      addFn() {
        if (this.saveOrder == 0) return;
        this.saveOrder = 0;
        this.temObj = {};
        for (var i in this.myobj[0]) {
          this.temObj[i] = "";
        }
        this.editIndex = this.myobj.length;
      
        if (!this.objKeys.isobj) {
          let obj={
            arr: this.objKeys.src,
            obj: "",
          }
          if(this.objKeys.isNotObj){
            obj.obj=""
          }else{
            obj.obj=this.temObj
          }
          this.$store.commit("addData",obj);
        } else {
          this.$store.commit("addObjAttr", {
            arr: this.objKeys.src,
            attr: "newObjAttr",
            obj: "",
          });
        }
      },
      async saveFn(index, item) {
        if (this.objKeys.name == "Quick copy") {
          await this.$http
            .post("/request/changestr", {
              name: this.$store.state.TheVersion,
              value: this.$store.state.user.time,
              str: this.temObj.content,
              method: "change",
            })
            .then((res) => {
              this.temObj.content = res.data;
            });
        }

        if (this.objKeys.name == "To do") {
          if (!this.temObj.time) {
            this.$store.commit("addWarningMessage", "Please set time");
            return;
          }
          if (!this.temObj.everyday && !this.temObj.date) {
            this.$store.commit("addWarningMessage", "Please set date");
            return;
          }
        }

        if (!this.objKeys.isobj) {
          let obj={
              index,
              arr: this.objKeys.src,
              obj: "",
            }
          if(this.objKeys.isNotObj){
            obj.obj=this.temObj["name"]
          }else{
            obj.obj=this.temObj
          }

          this.$store
            .dispatch("editDataAction",obj)
            .then(() => {
              this.saveFile()
            });
        } else {

          if (this.temObj.attr == "") {
            this.$store.commit("addWarningMessage", "attr can't be empty")
            return
          }
          let sameAttrIndex = this.findObjSameAttr(this.temObj.attr)
          if (this.saveOrder == 0 && sameAttrIndex > -1) {
            this.$store.commit("addWarningMessage", "attr can't be repeat")
            return
          }
          if (this.saveOrder != 0 && sameAttrIndex != -1 && sameAttrIndex != index) {
            this.$store.commit("addWarningMessage", "attr can't be repeat")
            return
          }
          this.$store
            .dispatch("editObjAttr", {
              arr: this.objKeys.src,
              newattr: this.temObj.attr,
              oldattr: item.attr,
              obj: this.temObj.content,
            })
            .then(() => {
              this.saveFile()
            });
        }
        this.editIndex = -1;
        this.saveOrder = -1;
      },
      deleteFn(index, item) {
        if (this.objKeys.systemSetting) {
          this.$store.commit("addWarningMessage", "can't delete system setting")
          return
        }
        if (this.myobj.length == 1) {
          this.$store.commit("addWarningMessage", "can't delete last one")
          return
        }

        if (!this.objKeys.isobj) {
          this.$store
            .dispatch("deleteDataAction", { index, arr: this.objKeys.src })
            .then(() => {
              this.saveFile()
            });
        } else {
          this.$store
            .dispatch("deleteObjAttr", { arr: this.objKeys.src, attr: item.attr })
            .then(() => {
              this.saveFile()
            });
        }
      },

      emmitFn(param) {
        this.$emit("table-click", param);
      },
      changebloon(str) {
        this.temObj[str] = !this.temObj[str];
        if (this.objKeys.name == "To do") {
          if (this.temObj.everyday) {
            this.temObj.date = "";
          }
        }
        this.forChangereresponse.name++;
      },
      findObjSameAttr(attr) {
        let resnumber = -1
        this.myobj.map((item, index) => {

          if (item.attr == attr) {
            resnumber = index
          }
        })
        return resnumber
      },

      saveFile() {
        if(this.objKeys.isNotObj){
          this.$http
          .post("/request/writeData", {
            path: "record",
            content: this.$store.state.recordData
          })
          .then((res) => {
            if (res.data.status) {
              this.$store.commit("addMessage", "operate success");
            } else {
              this.$store.commit("addImportantMessage", "operate fail");
            }
          });
        }else{
          this.$http
          .post("/request/writeLifeData", this.$store.state.lifeData)
          .then((res) => {
            if (res.data.status) {
              this.$store.commit("addMessage", "operate success");
            } else {
              this.$store.commit("addImportantMessage", "operate fail");
            }
          });

        }
 
      }
    },

    components: {},
  };
</script>

<style scoped>
  .table-div {
    padding: 15px;
    padding-top: 6px;
  }

  h5 {
    float: left;
    font-weight: normal;
    font-size: 15px;
    color: rgba(0, 200, 255, 0.906);
  }

  table {
    border: none;

    margin-top: 10px;
  }

  thead {
    text-align: center;
  }

  tr td {
    border: 1px solid skyblue;
    border-left-width: 0px;
    border-top-width: 0px;
    padding: 2px 10px;
    height: 45px;
  }

  tr td:first-child {
    border-left-width: 1px;
  }

  tr:first-child td {
    border-top-width: 1px;
  }

  tbody tr:nth-child(even) {
    background: rgb(254 255 228);
  }

  tbody tr:nth-child(odd) {
    background: rgb(237 255 221 / 55%);
  }

  tbody tr:hover {
    background: rgba(7, 185, 99, 0.103);
  }

  button {
    padding: 5px 11px;
    font-size: 12px;
    border-radius: 3px;
    color: #606266;
    border: 1px solid #dcdfe6;
    background: #fff;
    margin-right: 5px;
  }

  button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
    cursor: pointer;
  }

  .btn-delete {
    background: #f56c6c;
    border: 1px solid #f56c6c;
    color: #fff;
  }

  .btn-delete:hover {
    background: #f56c6ccd;
    color: #fff;
    border: 1px solid #f56c6c;
  }

  .btn-save {
    background: #008c8cd5;
    border: 1px solid #008c8c;
    color: #fff;
  }

  .btn-save:hover {
    background: #008c8c;
    border: 1px solid #007474;
    color: #fff;
  }

  .add {
    width: 20px;
    height: 20px;
    padding: 0;
    text-align: center;
    line-height: 20px;
    float: right;
    border: 1px solid #dcdfe6;
    background: #fff;
    border-radius: 3px;
  }

  textarea {
    width: 100%;
    height: 75px;
    outline: 0;
    padding: 5px;
    border: none;
  }

  .button-td {
    display: inline-block;
  }

  .textarea-td {
    display: inline-block;
    width: 100%;
  }

  .text-td {
    display: inline-block;
  }

  .operate-td {
    display: inline-block;
  }

  .table-tbody {

    height: 450px;
    overflow: auto;

  }
  .tableNo{
    width: 25px;
    text-align: center;
    color: orange;
  }
</style>