<template>
  <div class="todo">
    <Message> </Message>
    <Table v-bind:objKeys="todoKeys">
      <template v-slot:remind="slotProps">
        <span
          v-if="slotProps.user.status"
          class="iconfont icon-tixing2 tixing"
        ></span>
        <span v-else class="iconfont icon-butixing"></span>
      </template>
      <template v-slot:everyday="slotProps">
        <span
          v-if="slotProps.user.status"
          class="iconfont icon-checkbox-xuanzhong xuanzhong"
        ></span>
        <span v-else class="iconfont icon-checkbox-weixuan"></span>
      </template>
      <template v-slot:remainder="slotProps">
       
        <span>{{slotProps.user.item | getRemainer}}</span>
      </template>
    </Table>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/crud/Table.vue";
import Message from "@/components/Message.vue";
import dayjs from "dayjs"; // ES 2015
export default {
  name: "Todo",
  data() {
    return {
      temObj: {},
      todoKeys: {
        name: "To do",
        src: ["lifeData", "todo"],
        key: [
          {
            name: "event",
            attribute: "text",
            width: "130px",
            textAlign: "left",
          },
          {
            name: "everyday",
            attribute: "bloon",
            width: "90px",
            textAlign: "center",
          },
          {
            name: "date",
            attribute: "control-date",
            width: "130px",
            textAlign: "left",
          },
          {
            name: "time",
            attribute: "control-time",
            width: "90px",
            textAlign: "left",
          },
          {
            name: "remainder",
            attribute: "new-slot",
            width: "90px",
            textAlign: "center",
          },
          {
            name: "remind",
            attribute: "bloon",
            width: "90px",
            textAlign: "center",
          },
        ],
      },
    };
  },
  components: {
    Table,
    Message
  },
  methods: {
    clickfn(obj) {
    
    },
  },
 
  filters:{
    getRemainer(item){
     
      let date1=0
      if(item.everyday){
        date1=dayjs(dayjs().format("YYYY-MM-DD"))
        }else{
          date1=dayjs(item.date)
        }
    
        const date2 = dayjs();
        let hours = date2.diff(date1, 'hours');
        let days = Math.floor(hours / 24);
        
        return days+" days"

    }
  }
};
</script>
<style scoped>
.todo {
  padding-top: 35px;
}
.xuanzhong {
  color: rgba(2, 211, 2, 0.79);
}
.tixing {
  color: orange;
}
</style>
