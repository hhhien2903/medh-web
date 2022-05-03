import { Col, Row } from 'antd';
import { FaUserFriends, FaDisease, FaMicrochip, FaUserMd } from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';
import { BsFileEarmarkMedicalFill } from 'react-icons/bs';
import doctorAPI from '../../../api/doctorAPI';
import CardStatistic from '../../../components/shared/CardStatistic/CardStatistic';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { useEffect, useState } from 'react';
import patientAPI from '../../../api/patientAPI';
import deviceAPI from '../../../api/deviceAPI';
import diseaseAPI from '../../../api/diseaseAPI';
import ruleConditionAPI from '../../../api/ruleAPI';
import hospitalAPI from '../../../api/hospitalAPI';
import ruleAPI from '../../../api/ruleAPI';
import { Link } from 'react-router-dom';
const ExpertDashboard = () => {
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();

  const [statisticSource, setStatisticSource] = useState([]);

  const getAllInfoStatistic = async () => {
    try {
      setIsLoadingSkeleton(true);
      const doctorSourceResult = await doctorAPI.getAllDoctors();
      const patientSourceResult = await patientAPI.getAllPatients();
      const deviceSourceResult = await deviceAPI.getAllDevices();
      const diseaseSourceResult = await diseaseAPI.getAllDiseases();
      const ruleSourceResult = await ruleAPI.getAllRules();
      const hospitalSourceResult = await hospitalAPI.getAllHospital();
      setStatisticSource({
        doctor: doctorSourceResult.length,
        patient: patientSourceResult.length,
        device: deviceSourceResult.length,
        disease: diseaseSourceResult.length,
        rule: ruleSourceResult.length,
        hospital: hospitalSourceResult.length,
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
          <Col span={6}>
            <CardStatistic
              link="/expert/doctor"
              number={statisticSource?.doctor}
              type={'Bác Sĩ'}
              icon={<FaUserMd opacity={0.5} size={70} />}
              iconBottom="-10px"
              iconRight="-10px"
            />
          </Col>
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
