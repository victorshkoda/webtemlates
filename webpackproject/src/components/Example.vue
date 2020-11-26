<template>
    <section>
        <div class="container">
            <h2>{{messge}}</h2>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Example",
        data(){
            return{
                messge: null
            }
        },
        created() {
            this.messge = this.$store.getters.getMessage
        }
    }
</script>

<style lang="scss" scoped>
h2{
    color: #068d3a;
}
</style>