<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchClass } from '@api/classes';
import { isAxiosError } from 'axios';
import { useSubjectsStore } from '@stores/subjects';
import { storeToRefs } from 'pinia';
import { toDateFR } from '@utils/date';
import AddFormModal from '@components/classes/AddFormModal.vue';
import QRCodeModal from '@components/classes/QRCodeModal.vue';

interface Subject {
  name: string;
  instructorName: string;
  instructorEmail: string;
  startDate: string;
  endDate: string;
}

interface ClassData {
  name: string;
  studentCount: number;
  studentEmails: string;
  description?: string;
  subjects: Subject[];
}

const tableColumns = [
  { key: 'subject', label: 'Matière' },
  { key: 'surveysLinks', label: 'Liens des formulaires de retours' },
  { key: 'actions', label: 'Retours' },
];

const formTypes = [
  { type: 'DURING_COURSE', label: 'Pendant le cours', icon: 'Clock' },
  { type: 'AFTER_COURSE', label: 'Fin du cours', icon: 'Check-Desktop' },
];

const route = useRoute();
const router = useRouter();

const initialLoading = ref(true);
const errorMessages = ref<string[]>([]);
const searchQuery = ref('');

const showAddFormModal = ref(false);
const classId = route.params.id as string;
const classData = ref<Partial<ClassData>>({});
const selectedSubjectId = ref<number | null>(null);

const subjectsStore = useSubjectsStore();
const { subjects } = storeToRefs(subjectsStore);

const filteredSubjects = computed(() => {
  if (!searchQuery.value) return subjects.value;
  const query = searchQuery.value.toLowerCase();
  return subjects.value.filter(
    (subject) => subject.name.toLowerCase().includes(query) || subject.instructorName.toLowerCase().includes(query)
  );
});

const showQRCodeModal = ref(false);
const qrCodeUrl = ref('');

const openQRCodeModal = (forms: any[], type: string) => {
  const form = forms.find((form: any) => form.type === type);
  if (form) {
    qrCodeUrl.value = `${window.location.origin}/form/${form.id}`;
    showQRCodeModal.value = true;
  }
};

const toggleAddFormModal = (value: boolean) => {
  showAddFormModal.value = value;
};

const openAddFormModal = (subjectId: number) => {
  selectedSubjectId.value = subjectId;
  toggleAddFormModal(true);
};

const handleFormsCreated = async () => {
  await subjectsStore.fetchSubjects(Number(classId));
};

const copyLink = (forms: any[], type: string) => {
  const form = forms.find((form: any) => form.type === type);
  if (form) {
    const url = `${window.location.origin}/form/${form.id}`;
    navigator.clipboard.writeText(url);
  }
};

onMounted(async () => {
  try {
    classData.value = await fetchClass(Number(classId));
    await subjectsStore.fetchSubjects(Number(classId));
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      router.push('/classes');
    } else {
      errorMessages.value.push('Impossible de charger les données de la classe');
    }
  } finally {
    initialLoading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="page-header">
        <div class="details-search">
          <div class="details">
            <h3>{{ classData.name }}</h3>
            <p>{{ classData.studentCount }} étudiants</p>
          </div>
          <div class="search-wrapper">
            <Input
              class="search-input"
              v-model="searchQuery"
              placeholder="Rechercher par intervenant, cours..."
              @update:modelValue="searchQuery"
            />
          </div>
        </div>

        <div class="page-actions">
          <Button
            variant="neutral"
            icon="Arrow"
            iconPosition="right"
            @click="router.push('/classes/' + classId + '/subjects')"
          >
            Gérer les matières
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            iconPosition="right"
            @click="router.push('/classes/' + classId + '/subjects/new')"
          >
            Ajouter une matière
          </Button>
        </div>
      </div>

      <Table :columns="tableColumns" :rows="filteredSubjects" striped>
        <template #cell-subject="{ row }">
          <div class="subject-cell">
            <div class="subject-details">
              <div class="subject-name-teacher">
                <p>{{ row.name }}</p>
                <p class="subject-teacher">{{ row.instructorName }}</p>
              </div>
              <p class="subject-dates">{{ toDateFR(row.startDate) }} - {{ toDateFR(row.endDate) }}</p>
            </div>
          </div>
        </template>

        <template #cell-surveysLinks="{ row }">
          <Button
            v-if="row.forms.length === 0"
            variant="secondary"
            icon="Arrow"
            iconPosition="right"
            width="fit"
            @click="openAddFormModal(row.id)"
          >
            Choisir le type de formulaire
          </Button>

          <div v-else class="row-forms">
            <template v-for="formType in formTypes" :key="formType.type">
              <Card v-if="row.forms.some((form: any) => form.type === formType.type)" :padding="0">
                <div class="row-form">
                  <div class="row-form-details">
                    <Icon :name="formType.icon" />
                    <p>{{ formType.label }}</p>
                  </div>

                  <div class="row-form-actions">
                    <Button
                      variant="neutral"
                      icon="Arrow"
                      iconPosition="right"
                      @click="copyLink(row.forms, formType.type)"
                    >
                      Copier le lien
                    </Button>
                    <Button
                      variant="plain"
                      icon="Download"
                      iconPosition="right"
                      @click="openQRCodeModal(row.forms, formType.type)"
                    >
                      QR Code
                    </Button>
                  </div>
                </div>
              </Card>
            </template>
          </div>
        </template>
      </Table>
    </div>

    <AddFormModal
      :isOpen="showAddFormModal"
      :subjectId="selectedSubjectId"
      @close="toggleAddFormModal(false)"
      @confirm="handleFormsCreated"
    />

    <QRCodeModal :isOpen="showQRCodeModal" :url="qrCodeUrl" @close="showQRCodeModal = false" />
  </div>
</template>

<style scoped>
.page-content {
  gap: 16px;
}

.subject-cell {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subject-name-teacher {
  display: flex;
  align-items: end;
  gap: 8px;
}

.subject-teacher {
  font-size: 10px;
  font-weight: 600;
}

.subject-dates {
  font-size: 12px;
}

.row-forms {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row-form {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 16px 18px;
  background-color: var(--gray-2);
}

.row-form-details {
  min-width: 150px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-form-details p {
  font-weight: 700;
}

.row-form-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.row-form-actions button {
  background-color: var(--white);
}
</style>
