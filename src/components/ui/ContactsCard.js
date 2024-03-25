export default function ContactCard({ contacts }) {
  console.log("Got following contacts : ", contacts);
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center w-full h-fit mb-5 p-4  ">
      <div className="text-blue-400 font-semibold text-2xl text-left w-full mb-5">
        Contacts :
      </div>
      <div className="divide-y-2 divide-blue-200 w-full flex flex-col gap-y-2">
        {contacts.map((contact, i) => (
          <div key={i} className="flex flex-col items-start w-full pt-2">
            <div className="flex items-center mb-4 w-full">
              {contact.profile_picture_url ? (
                <div className={`avatar mr-2`}>
                  <div className="w-12 rounded-full">
                    <img src={contact.profile_picture_url} />
                  </div>
                </div>
              ) : (
                <div className="bg-blue-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center mr-2">
                  <span className="text-base font-bold">{`${
                    contact.first_name.split("")[0]
                  }${contact.last_name.split("")[0]}`}</span>
                </div>
              )}
              <div className="w-full flex flex-col">
                <div className="text-purple-400 text-lg font-semibold">
                  {`${contact.first_name} ${contact.last_name}`}
                </div>
                <div className="text-base font-semibold mb-1 flex items-center flex-wrap gap-1">
                  {contact.type.map((type, i) => (
                    <div
                      className="badge bg-blue-300 text-white border-0"
                      key={i}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <a
                className="px-4 py-2 rounded-full bg-blue-400 font-semibold text-white shadow hover:bg-blue-600 hover:shadow-xl"
                href={`tel:${contact.phone}`}
              >
                Appeler
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
