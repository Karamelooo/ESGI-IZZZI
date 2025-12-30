<script lang="ts" setup>
import Logo from '@components/base/Logo.vue';
import Button from '@components/base/Button.vue';
</script>

<template>
  <div class="footer-wrapper">
    <div class="footer-decoration">
      <div class="pill yellow rotate-a-lot-right" style="justify-self: start  ; margin-left: -0.5vw; margin-top: -2vh;">#Love</div>
      <div class="pill white rotate-little-right" style="justify-self: start; margin-left: -0.5vw; margin-top: 6vh;">IA + education = <3</div>
      <div class="pill orange rotate-left" style="justify-self: start; margin-left: 5vw; margin-top: 0.6vh;">#QualiopiFriendly</div>
      <div class="pill yellow rotate-a-lot-right" style="justify-self: start; margin-left: -6vw; margin-top: -14vh;">#Simple</div>
      <div class="pill white" style="justify-self: start; margin-left: -3vw; margin-top: 7.5vh;">#DoubleSatisfaction</div>
      <div class="pill orange rotate-a-lot-right" style="justify-self: start; margin-left: -6vw; margin-top: -1.5vh;">#LiveReview</div>
      <div class="pill yellow rotate-left" style="justify-self: start; margin-right: 10vw; margin-left: -12vw; margin-top: -25vh;">#Sincère</div>
    </div>

    <footer class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <Logo :size="130" />
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4>Plan du site</h4>
            <ul>
              <li><router-link to="/pricing">Nos tarifs</router-link></li>
              <li><router-link to="/auth/register">S'inscrire</router-link></li>
              <li><router-link to="/auth/login">Se connecter</router-link></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Nous contacter</h4>
            <Button link="mailto:hello@izzzi.io" variant="neutral" class="contact-btn">
              hello@izzzi.io
            </Button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <router-link to="/legal">Mentions légales</router-link>
        <router-link to="/faq">FAQ</router-link>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-wrapper {
  position: relative;
  color: white;
  padding-top: 15vh;
  overflow: hidden;
}

.footer-decoration {
  padding-top: 0;
  padding-left: 0;
  width: 110vw;
  height: 15vh;
  pointer-events: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pill {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 0.5em;
  height: 7vh;
  width: 40vw !important;
  border-radius: 50px;
  font-family: 'Mochiy Pop One', sans-serif;
  font-size: 0.7rem;
  color: var(--black, #000);
}

.pill.yellow { background-color: var(--yellow, #FDE047); }
.pill.orange { background-color: #F69D04; }
.pill.white { background-color: white; }

.rotate-left { transform: rotate(-15deg); }
.rotate-right { transform: rotate(10deg); }
.rotate-little-right { transform: rotate(4deg); }
.rotate-a-lot-right { transform: rotate(20deg); }

.footer-content {
  width: 100%;
  height: 50vh;
  padding-left: 10vw;
  padding-right: 10vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rem;
  background-color: var(--dark-orange, #F26103);
}

.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-column h4 {
  font-family: 'Mochiy Pop One', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-column a {
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.footer-column a:hover {
  opacity: 1;
}

.contact-btn {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5em 1.5em;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
}

.footer-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.footer-bottom a {
  color: white;
  text-decoration: none;
}

@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-content {
    height: 75vh;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }
  
  .footer-bottom {
    justify-content: center;
    align-items: center;
  }

  .footer-decoration {
    display: none;
  }
}
</style>
