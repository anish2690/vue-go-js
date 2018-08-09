<template>
    <div>
        <p>test</p>
        <test   v-bind:model-data="diagramData" ></test>
    </div>
</template>
<script>
import Test from '@/components/Diagrams.vue'
export default {
    components:{
        Test
    },
    data() {
        return {
            diagramData: {  // passed to  as its modelData
            nodeDataArray: [
            { key: 1, text: "Alpha", color: "lightblue" },
            { key: 2, text: "Beta", color: "orange" },
            { key: 3, text: "Gamma", color: "lightgreen" },
            { key: 4, text: "Delta", color: "pink" }
            ],
            linkDataArray: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 3, to: 4 }
            ]
        },
        }
    }
}
</script>
<style scoped>

</style>
