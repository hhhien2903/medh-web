import { Col, Row } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { BsFileEarmarkMedicalFill } from 'react-icons/bs';
import { FaDisease, FaMicrochip, FaUserFriends, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';
import deviceAPI from '../../../api/deviceAPI';
import diseaseAPI from '../../../api/diseaseAPI';
import doctorAPI from '../../../api/doctorAPI';
import hospitalAPI from '../../../api/hospitalAPI';
import medicalRecordAPI from '../../../api/medicalRecordAPI';
import patientAPI from '../../../api/patientAPI';
import ruleAPI from '../../../api/ruleAPI';
import CardStatistic from '../../../components/shared/CardStatistic/CardStatistic';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { AppContext } from '../../../contexts/AppProvider';
const ExpertDashboard = () => {
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const { statisticSource, setStatisticSource } = useContext(AppContext);

  const getAllInfoStatistic = async () => {
    try {
      if (!statisticSource) {
        setIsLoadingSkeleton(true);
      }

      const doctorSourceResult = await doctorAPI.getAllDoctors();
      const patientSourceResult = await patientAPI.getAllPatients();
      const deviceSourceResult = await deviceAPI.getAllDevices();
      const diseaseSourceResult = await diseaseAPI.getAllDiseases();
      const medicalRecordSourceResult = await medicalRecordAPI.getAllMedicalRecord();
      const ruleSourceResult = await ruleAPI.getAllRules();
      const hospitalSourceResult = await hospitalAPI.getAllHospital();
      setStatisticSource({
        doctor: doctorSourceResult.length,
        patient: patientSourceResult.length,
        device: deviceSourceResult.length,
        disease: diseaseSourceResult.length,
        rule: ruleSourceResult.length,
        hospital: hospitalSourceResult.length,
        medicalRecord: medicalRecordSourceResult.filter(
          (medicalRecord) => medicalRecord.treated === false
        ).length,
      });
      setIsLoadingSkeleton(false);
    } catch (error) {
      setIsLoadingSkeleton(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllInfoStatistic();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Row gutter={[20, 20]}>
          <Col span={6} sm={12} lg={6} xs={24}>
            <CardStatistic
              link="/expert/doctor"
              number={statisticSource?.doctor}
              type={'Bác Sĩ'}
              icon={<FaUserMd opacity={0.5} size={70} />}
              iconBottom="-10px"
              iconRight="-10px"
            />
          </Col>
          <Col span={6} sm={12} lg={6} xs={24}>
            <CardStatistic
              link="/expert/patient"
              type={'Bệnh Nhân'}
              number={statisticSource?.patient}
              icon={<FaUserFriends opacity={0.5} size={85} />}
              iconBottom="-20px"
              iconRight="-15px"
              cardBackground="linear-gradient(to right, #fdc830, #f37335)"
            />
          </Col>
          <Col span={6} sm={12} lg={6} xs={24}>
            <CardStatistic
              type={'Thiết Bị'}
              link="/expert/device"
              number={statisticSource?.device}
              icon={<FaMicrochip opacity={0.5} size={70} />}
              iconBottom="-15px"
              iconRight="-15px"
              cardBackground="linear-gradient(to left, #348f50, #56b4d3)"
            />
          </Col>
          <Col span={6} sm={12} lg={6} xs={24}>
            <CardStatistic
              link="/expert/disease"
              type={'Mầm Bệnh'}
              number={statisticSource?.disease}
              icon={<FaDisease opacity={0.5} size={85} />}
              iconBottom="-20px"
              iconRight="-15px"
              cardBackground="linear-gradient(to right, #cc2b5e, #753a88)"
            />
          </Col>
          <Col span={6} sm={12} lg={8} xs={24}>
            <CardStatistic
              link="/expert/rule"
              type={'Tập Luật Y Tế'}
              number={statisticSource?.rule}
              icon={<BsFileEarmarkMedicalFill opacity={0.5} size={75} />}
              iconBottom="-20px"
              iconRight="-15px"
              cardBackground="linear-gradient(to left, #203a43, #2c5364)"
            />
          </Col>
          <Col span={6} sm={12} lg={8} xs={24}>
            <CardStatistic
              link="/expert/medical-record"
              type={'Bệnh Án'}
              number={statisticSource?.medicalRecord}
              icon={<FaNotesMedical opacity={0.5} size={70} />}
              iconBottom="-10px"
              iconRight="-10px"
              cardBackground="linear-gradient(to left, #636363, #a2ab58)"
            />
          </Col>
          <Col span={6} sm={12} lg={8} xs={24}>
            <CardStatistic
              link="/expert/hospital"
              type={'Bệnh Viện'}
              number={statisticSource?.hospital}
              icon={<RiHospitalFill opacity={0.5} size={70} />}
              iconBottom="-10px"
              iconRight="-10px"
              cardBackground="linear-gradient(to left, #4e54c8, #8f94fb)"
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ExpertDashboard;
