<script lang="ts" setup>
import Banderole from '@components/animated/Banderole.vue';
import CardClassHome from '@components/layout/CardClassHome.vue';
import Button from '@components/base/Button.vue';
import Footer from '@components/page/Footer.vue';
import CardClassButton from '@/components/layout/CardClassButton.vue';
import CardClass from '@/components/layout/CardClass.vue';
</script>

<template>
  <div class="home-container">
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
            <Button link="/auth" variant="primary" icon="Arrow" iconPosition="right" class="cta-button">
              Essayer gratuitement
            </Button>
            <p class="cta-text">
              4 mois d'essai illimité. Facturation simple par <br />
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
            <img
              src="@assets/images/izzzi-dashboard-preview.png"
              alt="IZZZI dashboard preview"
              class="hero-image-dashboard"
            />
          </div>
          <div>
            <img src="@assets/images/home-page-devs-working-team.png" alt="devs working team" class="hero-image-devs" />
          </div>
          <div>
            <img
              src="@assets/images/home-page-woman-typping-phone.png"
              alt="woman typing phone"
              class="hero-image-woman-typping-phone"
            />
          </div>
          <div>
            <CardClassButton title="Basique" desc="Adapté à tous les cours" class="blured-card basique-card" />
          </div>
          <div>
            <CardClass
              className="A3UI"
              :studentsCount="24"
              classDesc="Description de la classe"
              :archived="true"
              class="blured-card premium-card"
            />
          </div>
        </div>
      </section>

      <div class="banderole-wrapper" />
      <Banderole />

      <section class="features-section">
        <div class="cards-container">
          <div>
            <CardClassHome
              title="Amélioration continue"
              text="Améliorez vos cours pendant qu’ils sont en cours. Recueillez les retours à chaud, ajustez immédiatement. Ne laissez pas vos étudiants repartir déçus."
              emphase="Ne soyez plus désolé"
            />
            <CardClassHome
              title="Qualiopi Friendly"
              text="Les deux indicateurs principaux de Qualiopi validé avec un seul outil. <br/>
              <br/>
              Indicateur 30 : Recueil des appréciations <br/>
              <br/>
              Indicateur 31 : Traitement des réclamations"
              emphase="Mieux que mieux !"
              style="background-color: var(--white, #fafafa); border: 1px solid #e0e0e0; height: 509px"
            />
          </div>

          <div>
            <CardClassHome
              title="Double satisfaction"
              text="Vos étudiants sont écoutés. Vous intervenez au bon moment. Résultat : un vrai sentiment d’écoute et une progression immédiate."
              emphase="Mieux que mieux !"
              style="background-color: var(--white, #fafafa); border: 1px solid #e0e0e0"
            />
            <CardClassHome
              title="Retours garantis 100% sincères"
              text="Des retours vraiment libres. Vos étudiants répondent sans compte, en toute confidentialité. Les retours sont anonymes par défaut."
              emphase="Même pas peur !"
              style="background-color: var(--orange, #f69d04); height: 406px"
            />
          </div>

          <div>
            <CardClassHome
              title="L'IA est la pour vous assister"
              text="N’offrez pas à vos étudiants l’occasion d’être déçus. Captez leurs retours avant la fin du module et ajustez ce qui mérite de l’être en live."
              emphase="Vous n’avez pas le temps !"
              style="background-color: var(--dark-orange, #f26103); border: 1px solid #e0e0e0; height: 583px"
            />
            <CardClassHome
              title="Prêt en 10 minutes chrono."
              text="Import CSV, génération automatique de QR code, lien à partager. Vos étudiants accèdent directement à leur formulaire, sans friction."
              emphase="C’est trop Izzzi !"
              style="height: 452px"
            />
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-container">
          <div class="stats-card">
            <h2>+73%</h2>
            <h3>de retours collectés en moyenne*</h3>
            <p>
              Les étudiants savent que leur avis change leur cours, pas celui du prochain semestre.
              <br /><br />
              Résultat : ils répondent plus, mieux, et plus vite.
            </p>
            <span class="footnote">*par rapport aux méthodes conventionnelles</span>
          </div>
          <div class="stats-image-container">
            <img src="@assets/images/home-page-people-talking.png" alt="People talking" class="stats-image" />
          </div>
        </div>
      </section>

      <section class="try-section">
        <div class="try-container">
          <h2>
            Créer une classe test <br />
            en quelques minutes.
          </h2>
          <p>
            C'est gratuit. 4 mois en illimité. Sans carte. <br />
            Vos premiers retours sont immédiats.
          </p>
          <Button link="/auth" variant="primary" icon="Arrow" iconPosition="right" class="cta-button">
            Créer une classe gratuitement
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.blured-card {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: #ffffff0d;
  z-index: 4 !important;
  border-color: var(--yellow);
}

.basique-card {
  position: absolute;
  top: -27vh;
  right: -5vw;
  transform: rotate(-15deg);
}

.premium-card {
  position: absolute;
  transform: rotate(-15deg);
  top: 22vh;
  left: 12vw;
  font-size: 1.5vh;
}

.try-section {
  padding: 5vh;
  background-color: var(--gray-5);
  display: flex;
  justify-content: center;
  z-index: 1;
}

.try-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
  background-color: var(--dark-orange, #f26103);
  border-radius: 10px;
  color: var(--white, #fafafa);
  max-width: 74vw;
  width: 100%;
  height: 35vh;
}

.stats-section {
  padding: 80px 20px;
  background-color: var(--gray-5);
  display: flex;
  justify-content: center;
  z-index: 1;
}

.stats-container {
  display: flex;
  gap: 40px;
  max-width: 74vw;
  width: 100%;
}

.stats-card {
  flex: 1;
  background-color: var(--gray-5);
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.stats-card h2 {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  color: #222;
}

.stats-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.stats-card p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  max-width: 80%;
}

.footnote {
  position: absolute;
  bottom: 30px;
  left: 60px;
  font-size: 0.75rem;
  color: #888;
}

.stats-image-container {
  flex: 2.2;
}

.stats-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

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
  z-index: 1;
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
  background-color: #fff9d8;
  overflow-x: hidden;
}

* {
  z-index: 0;
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20vh 2vw;
  text-align: center;
  background-color: #fff9d8;
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
  z-index: 1;
  width: 30%;
  right: 28vw;
  top: -25vh;
}

.hero-image-woman-typping-phone {
  position: absolute;
  z-index: 1;
  width: 15%;
  right: 43vw;
  top: 20vh;
}

.hero-image-dashboard {
  position: absolute;
  z-index: 2;
  width: 70%;
  right: -2vw;
  top: -35vh;
}

.hero-image-devs {
  position: absolute;
  z-index: 3 !important;
  width: 30%;
  right: -2vw;
  top: 22vh;
}

.banderole-wrapper {
  z-index: 4;
  height: 9vh;
  width: 120vw;
  --gradient-angle: -177deg;
  background: linear-gradient(var(--gradient-angle), transparent 50%, var(--gray-5) 50%);
  margin-bottom: -5vh;
}

.banderole {
  transform: rotate(3deg);
  z-index: 100;
  width: 120vw;
  margin-left: -5vw;
  margin-top: -2vh;
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
  background-color: var(--gray-5);
  display: flex;
  justify-content: center;
  z-index: 1;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
  justify-content: center;
}

.cards-container div {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  align-self: end;
}

@media (max-width: 768px) {
  .rounded-arrow {
    left: 55vw;
    top: -1vh;
  }

  .hero-section {
    justify-content: start;
    margin-bottom: 35vh;
  }

  .hero-section .hero-content {
    width: max-content;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-section .hero-content {
    z-index: 1;
  }

  .hero-section .hero-image {
    position: relative;
    width: 300vw;
  }

  .hero-image-woman {
    position: absolute;
    transform: scale(7);
    right: 65vw;
    top: 47vh;
  }

  .hero-image-dashboard {
    position: absolute;
    transform: scale(7);
    right: 0vw;
    top: 80vh;
  }

  .hero-image-devs {
    display: none;
  }

  .hero-image-woman-typping-phone {
    position: absolute;
    transform: scale(7);
    right: 85vw;
    top: 80vh;
  }

  .basique-card {
    position: absolute;
    transform: scale(0.7) rotate(-15deg);
    top: 35vh;
    right: -40vw;
  }

  .premium-card {
    position: absolute;
    transform: scale(0.7) rotate(-15deg);
    top: 72vh;
    left: -75vw;
  }

  .banderole-wrapper {
    --gradient-angle: -176deg;
  }

  .banderole {
    width: 120vw;
    margin-left: -5vw;
    margin-top: -3vh;
  }

  .cards-container {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    gap: 1vh;
    overflow-x: scroll;
    scroll-behavior: smooth;
    width: 100vw;
    margin-left: -3vw;
  }

  .cards-container div {
    flex-direction: row;
    max-height: 452px;
    min-height: 452px;
  }

  .cards-container div * {
    flex-direction: column;
  }

  .features-section {
    width: max-content;
  }

  .subtitle {
    width: max-content;
  }

  .cta-group {
    flex-direction: column;
    align-items: start;
    justify-self: start;
    width: max-content;
  }

  .zigzag-arrow {
    display: none;
  }

  .try-section {
    display: none;
  }

  .stats-container {
    max-width: fit-content;
    gap: 1vh;
  }

  .stats-card h2 {
    font-size: 4rem;
  }

  .stats-card p {
    font-size: small;
  }

  .stats-image-container {
    width: 100%;
  }

  .stats-image {
    max-width: fit-content;
    height: 50vh;
  }

  .stats-container {
    flex-direction: column;
  }

  .stats-card {
    padding: 30px;
  }

  .stats-card h2 {
    font-size: 3.5rem;
  }

  .footnote {
    position: static;
    margin-top: 2rem;
  }
}
</style>
