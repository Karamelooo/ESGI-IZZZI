<script lang="ts" setup></script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="fb-content">
        <div class="fb-header">
          <h2>Retours des étudiants</h2>
          <IconTextList
            :items="[
              { icon: 'Laptop', text: 'Matière' },
              { icon: 'People', text: 'Classe' },
              { icon: 'School', text: 'École' },
            ]"
          />
        </div>

        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>

      <Card :padding="28" :spacing="24" class="fb-sidebar">
        <div class="fb-sidebar-content">
          <h3>Partage</h3>
          <p>Partagez ce lien aux étudiants pour obtenir plus de réponses, ou téléchargez le QR code.</p>
          <Input value="https://" :disabled="true" />
          <Button variant="plain" icon="Import" iconPosition="right">Télécharger le QR code</Button>
        </div>

        <div class="fb-sidebar-content">
          <h3>Export</h3>
          <p>Exportez les retours dans le format de votre choix (.CSV ou .XLSX).</p>
          <Button icon="Arrowdown" iconPosition="right">Exporter les retours</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  flex-direction: row;
}

.fb-content {
  flex: 3;
}

.fb-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fb-header h2 {
  font-size: 32px;
  font-weight: 400;
}

.fb-sidebar {
  flex: 1;
}

.fb-sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fb-sidebar-content h3 {
  font-size: 18px;
  font-weight: 400;
}

.fb-sidebar-content p {
  font-size: 12px;
  line-height: 1.5;
}
</style>
