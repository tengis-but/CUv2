import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-hidden"
        >
          <motion.div
            key="modal"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[720px] max-h-[80vh] overflow-y-auto hide-scrollbar bg-white dark:bg-[#0e0e0e] rounded-xl shadow-lg p-8 text-gray-900 dark:text-[#eaeaea]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-600 dark:text-[#eaeaea]/60 hover:text-gray-900 dark:hover:text-[#eaeaea] transition-colors cursor-pointer"
              aria-label="Close info modal"
            >
              <X className="w-5 h-5" />
            </button>

            <section className="space-y-6 text-[15px]">
              <h2 className="text-xl font-semibold text-center">
                AI Employee Assistant-г зөв ашиглах 7 зөвлөгөө
              </h2>

              <ol className="list-decimal space-y-6 pl-4">
                <li className="space-y-2">
                  <h3 className="font-semibold text-base">
                    Боловсруулсан өгөгдөл дотроос мэдээлэл асуух
                  </h3>
                  <p>
                    Энэхүү AI туслах нь байгууллагын бодлого, гарын авлага, үйл
                    ажиллагааны журам гэх мэт PDF бичиг баримтыг уншиж ойлгодог.
                    Жишээлбэл: HR-ийн журам, борлуулалтын гарын авлага,
                    техникийн баримт бичиг гэх мэт. Та AI-аас зөвхөн тухайн
                    оруулсан PDF-д агуулагдаж буй мэдээллийг л асууж болно.
                  </p>
                </li>

                <li className="space-y-2">
                  <h3 className="font-semibold text-base">
                    Асуултаа тодорхой, энгийнээр бич
                  </h3>
                  <p>
                    Яг юу мэдмээр байгаагаа ойлгомжтой, товчхон бичих нь чухал.
                  </p>
                  <p>
                    <strong>Буруу хэрэглээ:</strong> &quot;Надад туслаач.&quot; &quot;Shine
                    ajiltnii anhaarah zuil&quot;
                  </p>
                  <p>
                    <strong>Зөв хэрэглээ:</strong> &quot;Компанийн шинэ ажилтны
                    сургалтын хугацаа хэдэн өдөр вэ?&quot;
                  </p>
                </li>

                <li className="space-y-2">
                  <h3 className="font-semibold text-base">
                    Түлхүүр үг ашиглаж асуух
                  </h3>
                  <p>
                    AI нь текстийн утга, холбоо ойлгодог боловч түлхүүр үг
                    оруулбал илүү нарийвчилсан хариулт өгнө.
                  </p>
                  <p>
                    <strong>Жишээ:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      &quot;2024 оны үйл ажиллагааны тайлан дахь гол үзүүлэлтүүдийг
                      жагсаа.&quot;
                    </li>
                    <li>
                      &quot;Маркетингийн стратегийн баримт бичиг дэх зорилтот
                      хэрэглэгчийн тодорхойлолтыг хэлж өг.&quot;
                    </li>
                  </ul>
                </li>

                <li className="space-y-2">
                  <h3 className="font-semibold text-base">
                    Олон PDF-оос аль нэгийг зааж асуух (хэрэв боломжтой бол)
                  </h3>
                  <p>
                    Хэрвээ олон баримт оруулсан бол аль баримтаас хайхыг зааж
                    болно.
                  </p>
                  <p>
                    <strong>Жишээ:</strong> &quot;Sales_Guide_2023.pdf-д байгаа
                    борлуулалтын үе шатуудыг жагсаа.&quot;
                  </p>
                </li>

                <li className="space-y-2">
                  <h3 className="font-semibold text-base">
                    Нууцлалтай мэдээлэл оруулахгүй байх
                  </h3>
                  <p>
                    AI туслах нь зөвхөн баримтанд суурилсан мэдээлэл өгдөг
                    боловч хувь хүний нууц, онцгой мэдрэг мэдээлэл оруулахгүй
                    байхаа анхаар.
                  </p>
                </li>
              </ol>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;