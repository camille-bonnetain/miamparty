<template>
  <div class="container">
    <div>
      <div>
        <b-carousel
          id="carousel-fade"
          style="text-shadow: 0px 0px 2px #000"
          fade
          indicators
          img-width="1344"
          img-height="896"
        >
          <b-carousel-slide caption="Convivialité" img-src="/images/miam1.jpg"></b-carousel-slide>
          <b-carousel-slide caption="Partage" img-src="/images/miam2.jpg"></b-carousel-slide>
          <b-carousel-slide caption="Saveurs" img-src="/images/miam3.jpg"></b-carousel-slide>
        </b-carousel>
      </div>

      <h1 id="brand" class="title">Miam Party</h1>
      <b-button pill size="lg" variant="primary" href="/login">Se connecter</b-button>
      <b-button pill size="lg" variant="success" href="/register">S'inscrire</b-button>
    </div>
  </div>
</template>

<script>
import logo from "@/components/Logo.vue";

export default {
  components: {
    logo
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Carter+One&display=swap");
#brand {
  font-family: "Carter One", cursive;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
