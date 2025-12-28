<script lang="ts" setup>
import { ref } from 'vue';
import Header from '@components/page/Header.vue';
import Banderole from '@components/animated/Banderole.vue';
import CardClassHome from '@components/layout/CardClassHome.vue';
import Button from '@components/base/Button.vue';

const activeTab = ref(0);
</script>

<template>
  <div class="home-container">
    <Header v-model:activeTab="activeTab"/>
    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1>
            Collectyez <img src="@assets/svg/icons/Orange-Rounded-Arrow.svg" alt="Arrow" class="rounded-arrow" /> <br />
            les <span class="highlight">retours</span> des <br />
            étudiants en live
          </h1>
          <p class="subtitle">
            + de retours d'étudiants <br />
            + de satisfaction
          </p>
          <div class="cta-group">
            <Button link="/auth/register" variant="primary" icon="Arrow" iconPosition="right" class="cta-button">
              Essayer gratuitement
            </Button>
            <p class="cta-text">
              4 mois d'essai illimité. Facturation simple par <br/>
              classe une fois la période d'essai terminée.
            </p>
          </div>
          <img src="@assets/svg/icons/Orange-Zigzag-Arrow.svg" alt="Arrow" class="zigzag-arrow" />
        </div>
        <div class="hero-image">
          <div>
            <img src="@assets/images/home-page-woman-outside.png" alt="Woman outside" class="hero-image-woman" />
          </div>
          <div>
            <img src="@assets/images/izzzi-dashboard-preview.png" alt="IZZZI dashboard preview" class="hero-image-dashboard" />
          </div>
          <div>
            <img src="@assets/images/home-page-devs-working-team.png" alt="devs working team" class="hero-image-devs" />
          </div>
        </div>
      </section>

      <Banderole style="z-index: 1;" />

      <section class="features-section">
        <div class="cards-container">
          <CardClassHome
            title="Amélioration continue"
            text="N’offrez pas à vos étudiants l’occasion d’être déçus. Captez leurs retours avant la fin du module et ajustez ce qui mérite de l’être en live."
            emphase="Ne soyez plus désolé"
          />
          <CardClassHome
            title="Double satisfaction"
            text="Un intervenant heureux fait des étudiants heureux. IZZZI vous permet de vous concentrer sur l’essentiel : la transmission de savoir."
            emphase="Tout le monde sourit"
          />
          <CardClassHome
            title="Assistance via IA"
            text="L'intelligence artificielle vous accompagne pour la rédaction de vos supports et l'analyse des retours étudiants."
            emphase="Gagnez du temps"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.rounded-arrow {
  position: absolute;
  z-index: 1;
  top: 1vw;
  left: 16vw;
}

.zigzag-arrow {
  position: relative;
  margin-top: 1em;
  height: 4em;
}

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

* {
  z-index: 0;
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8vh 2vw;
  text-align: center;
  background-color: #FFF9D8;
}

.hero-section .hero-content {
  position: relative;
  width: 50vw;
  text-align: left;
  margin-left: 5vw;
  margin-top: 10vh;
} 

.hero-section .hero-image {
  position: relative;
  width: 100%;
}

.hero-content h1 {
  font-size: 2.5vw;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 2vh;
  margin-top: 5vh;
}

.hero-image-woman {
  position: absolute;
  z-index: -2;
  width: 15%;
  justify-self: right;
  align-self: right;
  right: 27vw;
  top: -20vh;
}

.hero-image-dashboard {
  position: absolute;
  z-index: -1;
  width: 55%;
  justify-self: right;
  align-self: right;
  right: -1vw;
  top: -35vh;
}

.hero-image-devs {
  position: absolute;
  z-index: -1;
  width: 25%;
  justify-self: right;
  align-self: right;
  right: -1vw;
  top: 10vh;
}

.highlight {
  text-decoration: underline;
  text-decoration-color: var(--dark-orange);
}

.subtitle {
  font-size: 1.25rem;
  color: var(--gray-60, #666);
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-group {
  display: flex;
  gap: 0.3em;
  justify-content: center;
  flex-direction: column;
}

.cta-text {
  font-size: 0.6rem;
  align-self: start;
  font-weight: bold;
  line-height: 1.6;
}

.cta-button {
  width: fit-content;
}

.features-section {
  padding: 80px 20px;
  background-color: var(--bg-secondary, #fafafa); /* Fallback */
  display: flex;
  justify-content: center;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  max-width: 1400px;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
  }

  .subtitle {
    width: max-content;
  }

  .cta-group {
    flex-direction: column;
    align-items: center;
    justify-self: center;
    width: max-content;
  }

  .cta-text {
    background-color: rgba(255, 215, 116, 0.514);
    backdrop-filter: blur(8px);
    mask-image: radial-gradient(ellipse, black 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse, black 40%, transparent 100%);
    padding: 1em 2em;
  }

  .rounded-arrow {
    display: none;
  }

  .hero-section .hero-image {
    margin: auto;
    position: absolute;
    z-index: -1;
  }

  .hero-image-woman {
    width: 35%;
    right: 70vw;
    top: -30vh;
  }

  .hero-image-dashboard {
    width: 100%;
    right: -1vw;
    top: -35vh;
  }

  .hero-image-devs {
    width: 60%;
    right: -1vw;
    top: 10vh;
  }
}
</style>
