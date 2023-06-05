import { memo, useEffect, useState } from "react";
// import { useToasts } from "../../context/ToastProvider/useToasts";
import { PageProps } from "@/types/PageProps";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/Inputs";
import { checkPagename, createPage } from "@/services/PageService";
import { Button } from "@/components/Buttons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Dialog from "@/components/Dialogs";

type DialogNewPageProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  addNewPage: (page: PageProps) => void;
};

const pagenamesList = [
  "SharKb0y",
  "LavaGr1ll",
  "h0meSlander",
  "El0nFluSheD",
  "Crytp0Boy",
  "XablinhA",
  "Br3ak1NgBeD",
  "LuxC00L",
  "PewDiePie",
  "LewDiePie",
  "Th4n0sTh3M4LL",
  "4TheH0rde",
  "Dr4c4ryS",
  "Le4veMe4l0n3",
  "M4ND4L0R14N",
  "3mpty",
  "YE",
];

const createPageFormSchema = z.object({
  pagename: z
    .string()
    .nonempty("Page name is required")
    .min(4, "Page name must have at least 4 characters")
    .refine(value => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value), "Name should contain only alphabets"),
});

type CreatePageFormData = z.infer<typeof createPageFormSchema>;

const DialogNewPage = ({ isOpen, setIsOpen, addNewPage }: DialogNewPageProps) => {
  const [pagename, setPagename] = useState("");
  const [isPagenameAvailable, setPagenameAvailable] = useState(true);
  const [examplePagename, setExamplePagename] = useState("");
  // const { errorToast, successToast } = useToasts();

  const {
    watch,
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePageFormData>({ resolver: zodResolver(createPageFormSchema) });

  if (watch("pagename") !== pagename) setPagename(watch("pagename"));

  useEffect(() => {
    if (isOpen) {
      reset();
      setPagename("");
      setExamplePagename(pagenamesList[~~(pagenamesList.length * Math.random())]);
    }
  }, [isOpen]);

  useEffect(() => {
    const pagenameQuery = setTimeout(() => {
      if (pagename && pagename.length > 0)
        checkPagename(pagename)
          .then(response => {
            setPagenameAvailable(response.isAvailable);
          })
          .catch(error => {
            console.log(error);
            // errorToast(error.message);
          });
    }, 300);
    return () => {
      clearTimeout(pagenameQuery);
    };
  }, [pagename]);

  const createNewPage = (data: CreatePageFormData) => {
    createPage(data.pagename)
      .then(res => {
        addNewPage(res.page);
        // successToast("Page successfully created.");
        setIsOpen(false);
      })
      .catch(error => {
        console.log(error);
        // errorToast(error.message);
      });
  };

  return (
    <Dialog
      title={
        <>
          Please choose your Page name~
          <br />↪ zoz.bio/
          <span className="text-indigo-500">{pagename ? pagename : examplePagename}</span>
        </>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="mt-2">
        <p className="text-sm text-gray-400">
          To prevent a BOT rush to get all short size page names, you can only create pages with at least 4 characters.
          If you still wants a short page name, there&apos;s some ways to get one:
          <br />
          1. Subscriptions. (SOON)
          <br />
          2. Prove that you owns that pagename in some other social medias like Instagram, Twitter, TikTok, etc.
          <br />
          3. Future events on discord. (SOON)
          <br />
          4. Be a nicely and lovely person on our discord server maybe?! 😳
          <br />
          <br />
          You can also create up to 2 pages per account without any subscription.
        </p>
      </div>

      <form className="mt-4 w-full space-y-2" onSubmit={handleSubmit(createNewPage)}>
        <div className="py-1">
          <Input
            id="pagename"
            type="text"
            label="Page Name"
            placeholder={examplePagename}
            minSize={4}
            size={30}
            register={register("pagename")}
            errorMessage={errors.pagename?.message}
            iconAdornment={
              isPagenameAvailable ? (
                <CheckIcon className="w-6 text-green-600" />
              ) : (
                <XMarkIcon className="w-6 text-red-600" />
              )
            }
          />
        </div>

        <Button
          id="create-page-btn"
          type="submit"
          label="Create page"
          disabled={isSubmitting || !isPagenameAvailable}
        />
      </form>
    </Dialog>
  );
};

export default memo(DialogNewPage);
