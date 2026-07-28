import { prisma } from '../config/db.js';

const DEFAULT_SETTINGS = {
  pixKey: '83999087188',
  companyName: 'Plural Locações & Eventos',
  whatsappSupport: '(83) 99908-7188',
  warehouseAddress: 'Av. Epitácio Pessoa, 1250 - Tambaú, João Pessoa - PB',
  depositPercent: '30%',
  rentalTerms: 'A devolução deve ocorrer até às 12h do dia acordado. Danos ou avarias serão cobrados separadamente.'
};

export async function getCompanySettings(req, res) {
  try {
    const settingsList = await prisma.companySetting.findMany();
    const settingsMap = { ...DEFAULT_SETTINGS };

    settingsList.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    return res.json(settingsMap);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return res.json(DEFAULT_SETTINGS);
  }
}

export async function updateCompanySettings(req, res) {
  try {
    const settingsObj = req.body;

    for (const [key, value] of Object.entries(settingsObj)) {
      await prisma.companySetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }

    return res.json({ message: 'Configurações atualizadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return res.status(500).json({ error: 'Erro ao salvar configurações.' });
  }
}
