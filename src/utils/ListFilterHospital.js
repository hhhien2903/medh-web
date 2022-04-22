import hospitalAPI from '../api/hospitalAPI';

const getListFilterHospital = async () => {
  try {
    const hospitalResult = await hospitalAPI.getAllHospital();
    let listFilterHospital = await Promise.all(
      hospitalResult.map((hospital) => {
        return { text: hospital.name, value: hospital.id };
      })
    );
    return listFilterHospital;
  } catch (error) {
    console.log(error);
  }
};

export default getListFilterHospital;
